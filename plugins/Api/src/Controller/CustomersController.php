<?php

namespace Api\Controller;

use Api\Controller\AppController;
use Cake\Event\Event;
use Api\Controller\Component\ResponseFormatterComponent;
use ItoolCustomer\Model\Entity\Customer;

/**
 * Customers Controller
 *
 *
 * @method \Api\Model\Entity\Customer[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class CustomersController extends AppController
{



    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index', 'edit', 'add', "delete"]);
        // $this->loadModel('ItoolCustomer.Customers');
        $this->loadModel('ItoolCore.CustomerAddresses');
        $this->loadModel('ItoolCore.CoreLanguages');
        $this->loadModel('ItoolCore.CoreCountries');
        $this->loadComponent($this->pluginName . '.' . $this->responseFormatterComponent);
    }

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Security->setConfig('unlockedActions', ['index', 'edit', 'add', "delete"]);
    }
    /**
     * Index method
     *
     * @return \Cake\Http\Response|null
     */
    public function index()
    {
        $this->loadModel('ItoolCustomer.Customers');
        $response = null;
        $status = 'Success';

        try {
            $defaultFilter = [
                'Customers.id' => ['name' => 'id', 'values' => []],
                'Customers.core_language_id' => ['name' => 'core_language_id', 'values' => [], 'multipleDelimiter' => ','],
                'Customers.first_name' => ['name' => 'first_name', 'values' => [], 'multipleDelimiter' => ','],
                'Customers.last_name' => ['name' => 'last_name', 'values' => []],
                'Customers.vat_number' => ['name' => 'vat_number', 'values' => []],
                'Customers.email' => ['name' => 'email', 'values' => []],
                'Customers.password' => ['name' => 'password', 'values' => []],
                'Customers.modified <=' => ['name' => 'createdTo', 'values' => []],
                'Customers.created >=' => ['name' => 'modifiedFrom', 'values' => []],
                'Customers.modified <' => ['name' => 'modifiedTo', 'values' => []],
            ];

            $defaultPagination = [
                'limit' => ['name' => 'limit', 'min' => 1, 'max' => 100, 'default' => 100],
                'page' => ['name' => 'page', 'default' => 1]
            ];

            $requestParams = $this->request->query;

            $filter = $this->parseRequestFilter($requestParams, $defaultFilter);
            $pagination = $this->parseRequestPagination($requestParams, $defaultPagination);
            $Customers = $this->Customers->find('all', [
                'contain' => ['CustomerAddresses']
            ])
                ->where($filter)
                ->limit($pagination['limit'])
                ->page($pagination['page']);
            $response = $this->{$this->responseFormatterComponent}->formatCustomers($Customers);
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
     * View method
     *
     * @param string|null $id Customer id.
     * @return \Cake\Http\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($id = null)
    {
        $customer = $this->Customers->get($id, [
            'contain' => [],
        ]);

        $this->set('customer', $customer);
    }

    /**
     * Add method
     *
     * @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $customers = $this->getRequest()->getData();
        foreach ($customers as $customerData) {
            $customerEntity = $this->Customers->newEntity();
            $customer = $this->Customers->patchEntity($customerEntity, $customerData);
            $newcustomer = $this->Customers->save($customer);
            $saveCustomer = $newcustomer->id;
            $address = $customers['0']['address'];
            if ($newcustomer->id) {
                $this->saveAddress($saveCustomer, $address);
            }
            if (!empty($customer->errors())) {
                $errors = $customer->errors();
                foreach ($errors as $columnName => $errorMessages) {
                    foreach ($errorMessages as $errorMessage) {
                        throw new \Exception(__($columnName . ': ' . $errorMessage));
                    }
                }
            }
        }
        $message = array('status' => 'success', 'message' => 'Customer Successfully Added');
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');
    }

    public function saveAddress($saveCustomer, $address)
    {
        $addressEntity = $this->CustomerAddresses->newEntity();
        $addressEntity->customer_id = $saveCustomer;
        $addressEntity->core_country_id = $address['core_country_id'];
        $addressEntity->company = $address['company'];
        $addressEntity->first_name = $address['first_name'];
        $addressEntity->last_name = $address['last_name'];
        $addressEntity->street_line_1 = $address['street_line_1'];
        $addressEntity->city = $address['city'];
        $addressEntity->postal_code = $address['postal_code'];
        $addressEntity->phone_number = $address['phone_number'];
        $newcustomerAddress = $this->CustomerAddresses->save($addressEntity);
    }    

    /**
     * Edit method
     *
     * @param string|null $id Customer id.
     * @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit($id = null)
    {
        if ($this->request->is(['patch', 'post', 'put'])) {
            $customerDatas = $this->getRequest()->getData();
            foreach ($customerDatas as $customerData) {
                $id = $customerData['id'];
                $customers = $this->Customers->get($id, [
                    'contain' => []
                ]);
                $customers = $this->Customers->patchEntity($customers, $customerData);
                if ($this->Customers->save($customers)) {
                    if(!empty($customerData['address'])){
                        $addresses = $customerData['address'];
                        $this->CustomerAddresses->updateAll($addresses, ['customer_id' => $id]);
                    }
                    $message = array('status' => 'success', 'message' => 'Customer Successfully Updated');
                } else {
                    $message = array('status' => 'error', 'message' => 'The customer can not be saved. Please, try again');
                }
            }
            $this->set([
                'my_response' => $message,
                '_serialize' => 'my_response',
            ]);
            return $this->RequestHandler->renderAs($this, 'json');
        }
        exit;
    }
    public function updateAddress($addresses,$id){
        foreach ($addresses as $address) {
            $companyAddresses['core_country_id'] = $address['country_id'];
            $companyAddresses['company'] = $address['company'];
            $companyAddresses['first_name'] = $address['first_name'];
            $companyAddresses['street_line_1'] = $address['street_line_1'];
            $companyAddresses['city'] = $address['city'];
            $companyAddresses['postal_code'] = $address['postal_code'];
            $companyAddresses['phone_number'] = $address['phone_number'];
            
        $this->CustomerAddresses->updateAll([$companyAddresses], ['customer_id' => $id]); 
        }
        return true;

    }

    /**
     * Delete method
     *
     * @param string|null $id Customer id.
     * @return \Cake\Http\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $customers = $this->getRequest()->getData();
        foreach ($customers as $customerData) {
            $id = $customerData['id'];
            $customer = $this->Customers->get($id);
                if ($this->Customers->delete($customer)) {
                    $message = array('status' => 'success', 'message' => 'The customer has been deleted.');
                } else {
                    $message = array('status' => 'error', 'message' => 'The customer can not be deleted. Please, try again.');
                }
        }
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');
    }
}
