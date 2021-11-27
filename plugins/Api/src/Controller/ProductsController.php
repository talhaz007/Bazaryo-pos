<?php
namespace Api\Controller;

use Api\Controller\AppController;
use Cake\Event\Event;
use Api\Controller\Component\ResponseFormatterComponent;
use Cake\Http\ServerRequest;
use Cake\ORM\TableRegistry;

/**
 * Products Controller
 *
 *
 * @method \Api\Model\Entity\Category[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ProductsController extends AppController
{

    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index', 'edit', 'add', 'delete']);
        $this->loadModel('ItoolCoreProduct.CoreProducts');
        $this->loadModel('ItoolCoreProduct.CoreCategories');
        $this->loadModel('ItoolCoreMarketplace.CoreMarketplaces');
        $this->loadModel('ItoolCore.CoreProductQuantities');
        $this->loadModel('ItoolCoreProduct.CoreProductEavAttributeValueVarchars');
        $this->loadModel('ItoolCoreProduct.CoreProductEavAttributeSets');
        $this->loadModel('ItoolCoreProduct.CoreProductEavAttributeGroups');
        $this->loadModel('ItoolCoreProduct.CoreProductAttributeValueDecimals');
        $this->loadModel('ItoolCoreProduct.CoreProductAttributeValueImages');
        $this->loadModel('ItoolCore.CoreProductEavAttributeGroupsCoreProductEavAttributes');
        $this->loadModel('ItoolCore.CoreProductEavAttributes');

        
        if ($this->CoreProducts->hasBehavior('Ocl')) {
            $this->CoreProducts->removeBehavior('Ocl');
        }
        $this->loadComponent($this->pluginName.'.'.$this->responseFormatterComponent);
    }

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Security->setConfig('unlockedActions', ['index', 'edit', 'add','delete']);
    }

    /**
     * Index method
     *
     * @return \Cake\Http\Response|null
     */
    public function index()
    {
        $response = null;
        $status = 'Success';

        try { 
            $defaultFilter = [
                'CoreProducts.id' => ['name' => 'id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreProducts.core_account_id ' => ['name' => 'core_account_id ', 'values' => [], 'multipleDelimiter' => ','],
                'CoreProducts.core_marketplace_id ' => ['name' => 'core_marketplace_id ', 'values' => [], 'multipleDelimiter' => ','],
                'CoreProducts.core_product_type_id ' => ['name' => 'core_product_type_id ', 'values' => []],
                'CoreProducts.core_product_eav_attribute_set_id ' => ['name' => 'core_product_eav_attribute_set_id ', 'values' => [], 'multipleDelimiter' => ','],
                'CoreProducts.parent_id  ' => ['name' => 'parent_id  ', 'values' => [], 'multipleDelimiter' => ','],
                'CoreProducts.sku' => ['name' => 'sku', 'values' => [], 'multipleDelimiter' => ','],
                'CoreProducts.created >=' => ['name' => 'modifiedFrom', 'values' => []],
                'CoreProducts.modified <' => ['name' => 'modifiedTo', 'values' => []],
            ];

            $defaultPagination = [
                'limit' => ['name' => 'limit', 'min' => 1, 'max' => 100, 'default' => 100],
                'page' => ['name' => 'page', 'default' => 1]
            ];

            $requestParams = $this->request->query;

            $filter = $this->parseRequestFilter($requestParams, $defaultFilter);
            $pagination = $this->parseRequestPagination($requestParams, $defaultPagination);
            $coreProductsAttributes = $this->CoreProductEavAttributes->find('all')->toArray();
            $coreProducts = $this->CoreProducts->find('all',[
                'contain' => ['CoreAccounts', 'CoreProductTypes', 'ParentCoreProducts', 'CoreProductQuantities', 'CoreProductEavAttributeSets']
            ])
                ->where($filter)
                ->limit($pagination['limit'])
                ->page($pagination['page']);
                $response = $this->formatProducts($coreProducts,$coreProductsAttributes);

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

    public function formatProducts($products,$attributes)
    {
        $formatedProducts = [];
        foreach ($products as $product) {
            $formatedProduct['id'] = $product->id;
            $formatedProduct['core_account_id'] = $product->core_account_id;
            $formatedProduct['core_marketplace_id'] = $product->core_marketplace_id;
            $formatedProduct['core_product_type_id'] = $product->core_product_type_id;
            $formatedProduct['sku'] = $product->sku;
            foreach ($attributes as $attribute){
                $this->CoreProducts->setCoreAccountId($product->core_account_id);
                $formatedProduct[$attribute->code] = $this->CoreProducts->getAttributeValueByCode($product->id,$attribute->code, $product->core_marketplace_id, true);              
            }
            $formatedProducts[] = $formatedProduct;
        }
        return $formatedProducts;
    }

    /**
     * View method
     *
     * @param string|null $id Category id.
     * @return \Cake\Http\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($id = null)
    {
        $product = $this->Products->get($id, [
            'contain' => [],
        ]);

        $this->set('product', $product);
    }

    /**
     * Add method
     *
     * @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        
        $bestProduct = $this->getRequest()->getData();        
        foreach ($bestProduct as $productData) {
            
            $catalogProduct = $this->CoreProducts->newEntity();
            $catalogProduct->id = $productData['id'];
            $catalogProduct->core_account_id = $productData['core_account_id'];
            $catalogProduct->core_marketplace_id =  $productData['core_marketplace_id'];
            $catalogProduct->core_product_type_id = $productData['core_product_type_id']; 
            $catalogProduct->core_product_eav_attribute_set_id = $productData['core_product_eav_attribute_set_id'];
            $catalogProduct->sku = $productData['sku'];
            $attributes = $this->CoreProductEavAttributes->find()
            ->where([
                'core_account_id' => 1
            ])->toArray();
            foreach ($attributes as $attribute) {

                if (isset($productData{$attribute->code})) {

                    $catalogProduct{$attribute->code} = $productData{$attribute->code};
                }
                $coreProductAttributeValue = $this->CoreProductEavAttributeGroupsCoreProductEavAttributes->newEntity();
                $coreProductAttributeValue->core_product_eav_attribute_set_id = $productData['core_product_eav_attribute_set_id'];
                $coreProductAttributeValue->core_marketplace_id =  $productData['core_marketplace_id'];
                $coreProductAttributeValue->core_product_eav_attribute_id  = $attribute['id'];
                $coreProductAttributeValue->core_product_eav_attribute_group_id = 1;
                $coreProductAttributeValue->sort_order = 0;
                $this->CoreProductEavAttributeGroupsCoreProductEavAttributes->save($coreProductAttributeValue);                              
            }

            $this->CoreProducts->setCoreMarketplaceId($catalogProduct->core_marketplace_id);
            $this->CoreProducts->setCoreAccountId($catalogProduct->core_account_id);
            $newProduct = $this->CoreProducts->save($catalogProduct);
            $saveProduct = $newProduct->id;
            $newCoreProductQuantities = $this->CoreProductQuantities->newEntity();
            $newCoreProductQuantities->core_product_id = $newProduct->id;
            $newCoreProductQuantities->quantity = $newProduct->quantity;
            $this->CoreProductQuantities->save($newCoreProductQuantities);
            $categories = TableRegistry::getTableLocator()->get('CoreCategoriesCoreProducts')->newEntity();            
            $categories->core_product_id = $newProduct->id;            
            $categories->core_category_id  = $productData['category_id'];
            TableRegistry::getTableLocator()->get('CoreCategoriesCoreProducts')->save($categories);            
            $attributesValue = $this->CoreProductEavAttributes->find()
            ->where([
                'core_account_id' => 1,
                'code' => 'profile'
            ])->first();            
            $coreProductAttribute = $this->CoreProductAttributeValueImages->newEntity();
            $coreProductAttribute->core_product_id  = $newProduct->id;
            $coreProductAttribute->core_marketplace_id =  $productData['core_marketplace_id'];
            $coreProductAttribute->core_product_eav_attribute_id = $attributesValue->id;
            $coreProductAttribute->value = $productData['profile'];                            
            $this->CoreProductAttributeValueImages->save($coreProductAttribute);
       }
        $message = array('status' => 'success', 'message' => 'Products Successfully Created');
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');
    }

    /**
     * Edit method
     *
     * @param string|null $id Category id.
     * @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit($id = null)
    {
        if ($this->request->is(['patch', 'post', 'put'])) {
            $bestproducts = $this->getRequest()->getdata();           
            foreach ($bestproducts as $bestproduct) {               
                $id = $bestproduct['id'];
                $product = $this->CoreProducts->get($id, [
                    'contain' => [
                        'CoreAccounts',
                        'CoreProductTypes',
                        'ParentCoreProducts',
                        'CoreCategories',
                        'CoreProductQuantities',
                        'CoreConfigurableAttributes',
                        
                    ]
                ]);
                $CoreCategoriesCoreProducts = TableRegistry::getTableLocator()->get('CoreCategoriesCoreProducts')->find('all')->where(['core_product_id' => $id])->first();

                $product->sku = $bestproduct['sku'];              
                
                $product->title = $bestproduct['title'];
                $product->description = $bestproduct['description'];
                $product->barcode = $bestproduct['barcode'];
                $product->price = $bestproduct['price'];
                $product->wholesale_price = $bestproduct['wholesale_price'];
                $product->is_online = $bestproduct['is_online'];
                $product->tax = $bestproduct['tax'];
                $product->quantity = $bestproduct['quantity'];
                $productQuantity['quantity'] = $bestproduct['quantity'];                
                $CoreCategoriesCoreProducts->core_category_id = $bestproduct['category_id'];
                $CoreCategoriesCoreProducts->core_product_id = $id;
                $this->CoreProductQuantities->updateAll($productQuantity, ['core_product_id' => $id]);
                TableRegistry::getTableLocator()->get('CoreCategoriesCoreProducts')->save($CoreCategoriesCoreProducts);                
                $this->CoreProducts->setCoreMarketplaceId(1);
                $this->CoreProducts->setCoreAccountId($bestproduct['core_account_id']);
                $this->CoreProducts->save($product);
                $message = array('status' => 'success', 'message' => 'Product Successfully Updated');
            }
            $this->set([
                'my_response' => $message,
                '_serialize' => 'my_response',
            ]);
            return $this->RequestHandler->renderAs($this, 'json');
        }
        exit;
    }

    /**
     * Delete method
     *
     * @param string|null $id Product id.
     * @return \Cake\Http\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $products = $this->getRequest()->getData();
        foreach ($products as $product) {
            $id = $product['id'];
            $product = $this->CoreProducts->get($id);
            if ($this->CoreProducts->delete($product)) {
                $message = array('status' => 'success', 'message' => 'The product has been deleted.');
            } else {
                $message = array('status' => 'error', 'message' => 'The product could not be deleted. Please, try again.');
            }
        }
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');
    }
}
