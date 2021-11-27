<?php
namespace Api\Controller;

use Api\Controller\AppController;
use Cake\Utility\Xml;
use Cake\Utility\Inflector;
use Cake\ORM\Table;
use Cake\ORM\TableRegistry;
use Cake\Datasource\ConnectionManager;
use Cake\Http;
use Cake\Datasource\EntityInterface;
use Cake\Event\Event;
use ItoolCore\Controller\Component\SearchBoxDataComponent;
use ItoolCore\Model\Table\CoreAccountsTable;
use ItoolCoreMarketplace\Model\Table\CoreMarketplaceGroupsTable;
use ItoolCoreMarketplace\Model\Table\CoreMarketplacesTable;
use ItoolCoreOrder\Model\Table\CoreCancelReasonsTable;
use ItoolCoreOrder\Model\Table\CoreOrderEventsTable;
use ItoolCoreOrder\Model\Table\CoreOrderShipmentStatusesTable;
use ItoolCoreOrder\Model\Table\CoreReturnReasonsTable;
use ItoolCoreOrder\Model\Table\CoreOrdersTable;
use ItoolCoreOrder\Model\Table\CoreOrderStatesTable;
use ItoolCoreOrder\Model\Table\CoreOrderStatusesTable;
use ItoolCoreOrder\Model\Table\CorePaymentMethodsTable;
use ItoolCoreOrder\Model\Table\CoreShippingMethodsTable;

/**
 * Order Controller
 *
 * @property CoreOrdersTable $CoreOrders
 * @property CoreOrderStatesTable $CoreOrderStates
 * @property CoreOrderEventsTable $CoreOrderEvents
 * @property CoreOrderStatusesTable $CoreOrderStatuses
 * @property CorePaymentMethodsTable $CorePaymentMethods
 * @property CoreShippingMethodsTable $CoreShippingMethods
 * @property CoreMarketplaceGroupsTable $CoreMarketplaceGroups
 * @property CoreMarketplacesTable $CoreMarketplaces
 * @property CoreAccountsTable $CoreAccounts
 * @property SearchBoxDataComponent $SearchBoxData
 * @property CoreCancelReasonsTable $CoreCancelReasons
 * @property CoreReturnReasonsTable $CoreReturnReasons
 */
class OrdersController extends AppController
{

    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';
   
    public function initialize()
    {
		parent::initialize();
        $this->Auth->allow(['index', 'edit', 'add','cancel','returns','shipments']);
        $this->loadModel('ItoolCore.CoreOrders');
        $this->loadModel('ItoolCore.CoreOrderProducts');
		$this->loadModel('ItoolCore.CoreAccounts');
        $this->loadModel('ItoolCoreOrder.CoreOrderStates');
        $this->loadModel('ItoolCoreOrder.CoreOrderStatuses');
        $this->loadModel('ItoolCoreOrder.CorePaymentMethods');
        $this->loadModel('ItoolCoreOrder.CoreShippingMethods');
        $this->loadModel('ItoolCoreMarketplace.CoreMarketplaceGroups');
        $this->loadModel('ItoolCoreMarketplace.CoreMarketplaces');
        $this->loadComponent($this->pluginName.'.'.$this->responseFormatterComponent);
    }

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);

        $this->Security->setConfig('unlockedActions', ['add', 'edit','cancel','returns','shipments']);
    }

    /**
     * Index method
     *
     * @return void
     */
    public function index()
    {
       
		ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $response = null;
        $status = 'Success';

        try {
            $defaultFilter = [
                'CoreOrders.marketplace_code' => ['name' => 'marketplace', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.marketplace_group_code' => ['name' => 'marketplaceGroup', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.account_code' => ['name' => 'account', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.payment_method_code' => ['name' => 'paymentMethod', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_method_code' => ['name' => 'shipmentMethod', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.state_code' => ['name' => 'state_code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.status_code' => ['name' => 'status', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.core_user_id' => ['name' => 'core_user_id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_id' => ['name' => 'customer_id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.core_account_id' => ['name' => 'core_account_id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.language_code' => ['name' => 'language_code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.status_name' => ['name' => 'status_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_title' => ['name' => 'customer_title', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_firstname' => ['name' => 'customer_firstname', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_lastname' => ['name' => 'customer_lastname', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_company' => ['name' => 'customer_company', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_email' => ['name' => 'customer_email', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_phone' => ['name' => 'customer_phone', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_street_1' => ['name' => 'customer_street_1', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_street_2' => ['name' => 'customer_street_2', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_postcode' => ['name' => 'customer_postcode', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_country_code' => ['name' => 'customer_country_code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.customer_country_name' => ['name' => 'customer_country_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_firstname' => ['name' => 'shipping_firstname', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_lastname' => ['name' => 'shipping_lastname', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_company' => ['name' => 'shipping_company', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_street_1' => ['name' => 'shipping_street_1', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_street_2' => ['name' => 'shipping_street_2', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_postcode' => ['name' => 'shipping_postcode', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_city' => ['name' => 'status', 'shipping_city' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_country_code' => ['name' => 'shipping_country_code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_country_name' => ['name' => 'shipping_country_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_firstname' => ['name' => 'invoice_firstname', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_lastname' => ['name' => 'invoice_lastname', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_company' => ['name' => 'invoice_company', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_street_1' => ['name' => 'invoice_street_1', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_street_2' => ['name' => 'invoice_street_2', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_postcode' => ['name' => 'invoice_postcode', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_city' => ['name' => 'invoice_city', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_country_code' => ['name' => 'invoice_country_code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.invoice_country_name' => ['name' => 'invoice_country_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.currency_code' => ['name' => 'currency_code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.currency_name' => ['name' => 'currency_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.payment_method_name' => ['name' => 'payment_method_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.shipping_method_name' => ['name' => 'shipping_method_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.external_purchase_date' => ['name' => 'external_purchase_date', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.core_marketplace_code' => ['name' => 'core_marketplace_code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.core_marketplace_name' => ['name' => 'core_marketplace_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreOrders.purchase_date >=' => ['name' => 'createdFrom', 'values' => []],
                'CoreOrders.purchase_date <=' => ['name' => 'createdTo', 'values' => []],
                'CoreOrders.modified >=' => ['name' => 'modifiedFrom', 'values' => []],
                'CoreOrders.modified <' => ['name' => 'modifiedTo', 'values' => []],
            ];

            $defaultPagination = [
                'limit' => ['name' => 'limit', 'min' => 1, 'max' => 100, 'default' => 100],
                'page' => ['name' => 'page', 'default' => 1]
            ];

            $requestParams = $this->request->query;
            if (empty($requestParams['state'])) {
				$requestParams['state'] = 'processing';
			}

            $filter = $this->parseRequestFilter($requestParams, $defaultFilter);
            $pagination = $this->parseRequestPagination($requestParams, $defaultPagination);

            $orders = $this->CoreOrders->find('all')
                ->where($filter)
                ->andWhere(['core_user_id' => 1])
                ->limit($pagination['limit'])
                ->page($pagination['page']);

            $sellerPluginName = Inflector::camelize(strtolower('amazon'));
            try {
                $this->loadComponent($sellerPluginName . '.' . $this->responseFormatterComponent);
            } catch (\Exception $exp) {
                $this->loadComponent($this->plugin . '.' . $this->responseFormatterComponent);
            }

            $response = $this->{$this->responseFormatterComponent}->formatOrders($orders);            
        } catch (\Exception $exp) {
            $response['Error'][] = [
                'Message' => $exp->getMessage()
            ];
            $status = 'Failure';
        }
        $this->set([
			'my_response' => $response,
			'_serialize' => 'my_response',
		]);
        return $this->RequestHandler->renderAs($this, 'json');
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {       
        $orderDatas = $this->getRequest()->getData();        
        foreach ($orderDatas as $orderData) {
            
            $coreOrderEntity = $this->CoreOrders->newEntity();
            $order = $this->CoreOrders->patchEntity($coreOrderEntity, $orderData);
            $order->created = date('Y-m-d H:i:s');
            $order->modified = date('Y-m-d H:i:s'); 
            try {
                $newOrder = $this->CoreOrders->save($order);
            } catch (\Exception $exp) {
                dd($exp);
            }
            if (!empty($order->errors())) {
                $errors = $order->errors();
                foreach ($errors as $columnName => $errorMessages) {
                    foreach ($errorMessages as $errorMessage) {
                        throw new \Exception (__($columnName . ': ' . $errorMessage));
                    }
                }
            }
            foreach ($orderData['core_order_products'] as $product) {
               
            
            $orderProduct = $this->CoreOrderProducts->newEntity();            
            $orderProduct->core_order_id   = $orderData['id'];
            $orderProduct->core_product_id   = $product['id'];
            $orderProduct->sku    = $product['sku'];        
            $orderProduct->name   = $product['name'];
            $orderProduct->single_price  = $product['single_price'];
            $orderProduct->tax_percent  = $product['tax_percent'];
            $orderProduct->quantity   = $product['quantity'];
            $orderProduct->external_identifier   = $product['external_identifier'];
            $orderProduct->marketplace_product_identifier    = $product['marketplace_product_identifier'];
            $orderProduct->external_fee_amount   = $product['external_fee_amount'];
            $this->CoreOrderProducts->save($orderProduct);
            }
        }
        


       
        $message = array('status' => 'success', 'message' => 'order successfully created');
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');
    }
    public function cancel()
    {
        /*$cancelledOrders = '
        [
			{
				"external_order_identifier":"699",
				"cancel_date":"2020-09-25 00:00:00",
				"cancel_reason_code":454,
				"cancel_reason_name":"test",
				"comment":"",
				"core_order_cancellation_items":[
					{
						"quantity":"2",
						"adjustment_amount":"0",
						"cancel_reason":"1",
						"comment":"",
						"external_identifier":"123",
						"is_processed":"0"
					}
				]
			},
			{
				"external_order_identifier":"599",
				"cancel_date":"2020-09-25 00:00:00",
				"cancel_reason_code":454,
				"cancel_reason_name":"test",
				"comment":"",
				"core_order_cancellation_items":[
					{
						"quantity":"2",
						"adjustment_amount":"0",
						"cancel_reason":"1",
						"comment":"",
						"external_identifier":"123",
						"is_processed":"0"
					}
				]
			}
		]
		';
		$cancelledOrders = json_decode($cancelledOrders,true);*/
        $cancelledOrders = $this->getRequest()->getData();
		foreach ($cancelledOrders as &$cancelledOrder) {

			if (empty($cancelledOrder['external_order_identifier'])) {
				$this->set([
					'my_response' => $this->{$this->orderComponent}->getErrorMessage('external_order_identifier is required'),
					'_serialize' => 'my_response',
				]);
				return $this->RequestHandler->renderAs($this, 'json');
			}
			$coreOrder = $this->CoreOrders->find()
				->where([
					'CoreOrders.external_order_identifier' => $cancelledOrder['external_order_identifier'],
				])
				->contain(['CoreOrderProducts'])
				->first();
			$coreOrderId = $coreOrder['id'];
			if (empty($coreOrderId)) {
				$this->set([
					'my_response' => $this->{$this->orderComponent}->getErrorMessage("external_order_identifier ".$cancelledOrder['external_order_identifier']." doesn't exist"),
					'_serialize' => 'my_response',
				]);
				return $this->RequestHandler->renderAs($this, 'json');
			}
			$cancelledOrder['core_order_id'] = $coreOrderId;
			$this->{$this->orderComponent}->saveOrderProductReferences($coreOrder['core_order_products']);
			foreach ($cancelledOrder['core_order_cancellation_items'] as &$cancelledOrderProduct) {
               $cancelledOrderProduct['core_order_product_id'] = $this->{$this->orderComponent}->getOrderProductReferences($cancelledOrderProduct['external_identifier']);
			}
		}

		$this->CoreOrders->CoreOrderCancellations->saveMany($this->CoreOrders->CoreOrderCancellations->newEntities($cancelledOrders));

        $message = array('status' => 'success', 'message' => 'order successfully cancelled');
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');

    }

    public function returns()
    {
        /*$returnOrders = '
        [
			{
				"external_order_identifier":"699",
                "return_date":"2020-09-25 00:00:00",
                "return_reason_code":454,
                "return_reason_name":"test",
                "comment":"order was dealy",
                "core_order_return_items":[
					{
						"quantity":"2",
						"rma":"kip",
						"external_identifier":"123",
						"is_processed":"0"
					}
				]
			},
			{
				"external_order_identifier":"599",
                "return_date":"2020-09-25 00:00:00",
                "return_reason_code":454,
                "return_reason_name":"test",
                "comment":"order was dealy",
                "core_order_return_items":[
					{
						"quantity":"2",
						"rma":"kip",
						"external_identifier":"123",
						"is_processed":"0"
					}
				]
			}
		]
		';*/
        $returnOrders = $this->getRequest()->getData();
        foreach ($returnOrders as &$returnOrder) {
            if (empty($returnOrder['external_order_identifier'])) {
                $this->set([
                    'my_response' => $this->getErrorMessage('external_order_identifier is required'),
                    '_serialize' => 'my_response',
                ]);
                return $this->RequestHandler->renderAs($this, 'json');
            }
            $coreOrder = $this->CoreOrders->find()
                ->where([
                    'CoreOrders.external_order_identifier' => $returnOrder['external_order_identifier'],
                ])
                ->contain(['CoreOrderProducts'])
                ->first();
            $coreOrderId = $coreOrder['id'];
            if (empty($coreOrderId)) {
                $this->set([
                    'my_response' => $this->{$this->orderComponent}->getErrorMessage("external_order_identifier ".$returnOrder['external_order_identifier']." doesn't exist"),
                    '_serialize' => 'my_response',
                ]);
                return $this->RequestHandler->renderAs($this, 'json');
            }
            $returnOrder['core_order_id'] = $coreOrderId;
            $this->{$this->orderComponent}->saveOrderProductReferences($coreOrder['core_order_products']);
            foreach ($returnOrder['core_order_return_items'] as &$returnedOrderProduct) {
                $returnedOrderProduct['core_order_product_id'] = $this->{$this->orderComponent}->getOrderProductReferences($returnedOrderProduct['external_identifier']);
            }

        }
        $this->CoreOrders->CoreOrderReturns->saveMany($this->CoreOrders->CoreOrderReturns->newEntities($returnOrders));

        $message = array('status' => 'success', 'message' => 'order successfully Returned');
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');

    }

    public function shipments()
    {
        /*$shipmentOrders = '
        [
			{
				"external_order_identifier":"599",
                "core_account_id":"1",
                "shipment_date":"2020-08-31 00:00:00",
                "carrier_name":"fedex2",
                "carrier_code":"test8",
                "tracking_code":"rtl",
                "tracking_link":"klior",
                "shipping_label":"germn",
                "shipping_cost":"0.00",
                "status_code":"delivered",
                "core_order_shipment_items":[
                    {
                        "external_identifier":"123",
                        "quantity":"2",
                        "is_processed":"0",
                        "processed_at":"2020-09-10 00:00:00",
                        "external_shipment_item_code":"1"
                    }
                ]
			},
			{
				"external_order_identifier":"699",
                "core_product_id":"1",
                "core_account_id":"1",
                "shipment_date":"2020-08-31 00:00:00",
                "carrier_name":"fedex2",
                "carrier_code":"test8",
                "tracking_code":"89rt",
                "tracking_link":"klior",
                "shipping_label":"germn",
                "shipping_cost":"0.00",
                "status_code":"delivered",
                "core_order_shipment_items":[
                    {
                        "external_identifier":"123",
                        "quantity":"2",
                        "is_processed":"0",
                        "processed_at":"2020-09-10 00:00:00",
                        "external_shipment_item_code":"1"
                    }
                ]
			}
		]
		';*/

        $shipmentOrders = $this->getRequest()->getData();
        foreach ($shipmentOrders as &$shipmentOrder) {
            if (empty($shipmentOrder['external_order_identifier'])) {
                $this->set([
                    'my_response' => $this->{$this->orderComponent}->getErrorMessage('external_order_identifier is required'),
                    '_serialize' => 'my_response',
                ]);
                return $this->RequestHandler->renderAs($this, 'json');
            }
            $coreOrder = $this->CoreOrders->find()
                ->where([
                    'CoreOrders.external_order_identifier' => $shipmentOrder['external_order_identifier'],
                ])
                ->contain(['CoreOrderProducts'])
                ->first();
            $coreOrderId = $coreOrder['id'];
            if (empty($coreOrderId)) {
                $this->set([
                    'my_response' => $this->{$this->orderComponent}->getErrorMessage("external_order_identifier ".$shipmentOrder['external_order_identifier']." doesn't exist"),
                    '_serialize' => 'my_response',
                ]);
                return $this->RequestHandler->renderAs($this, 'json');
            }
            //$returnOrder['core_order_id'] = core_order_id;
            $this->{$this->orderComponent}->saveOrderProductReferences($coreOrder['core_order_products']);
            foreach ($shipmentOrder['core_order_shipment_items'] as &$shipedOrderProduct) {
                $shipedOrderProduct['core_order_product_id'] = $this->{$this->orderComponent}->getOrderProductReferences($shipedOrderProduct['external_identifier']);
                $shipedOrderProduct['core_order_id'] = $coreOrderId;
            }

        }
        $this->CoreOrders->CoreOrderShipmentItems->CoreOrderShipments->saveMany($this->CoreOrders->CoreOrderShipmentItems->CoreOrderShipments->newEntities($shipmentOrders));

        $message = array('status' => 'success', 'message' => 'order successfully shipped');
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');

    }

}
