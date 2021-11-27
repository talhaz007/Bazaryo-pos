<?php
namespace Api\Controller;

use Api\Controller\AppController;
use Cake\Event\Event;
use Api\Controller\Component\ResponseFormatterComponent;

/**
 * Categories Controller
 *
 *
 * @method \Api\Model\Entity\Category[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class CategoriesController extends AppController
{
    
    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';
    
    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index', 'edit', 'add', 'delete']);
        $this->loadModel('ItoolCore.CoreCategories');
        $this->loadComponent($this->pluginName.'.'.$this->responseFormatterComponent);
    }
    
    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Security->setConfig('unlockedActions', ['index', 'edit', 'add', 'delete']);
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
                'CoreCategories.id' => ['name' => 'id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreCategories.parent_id' => ['name' => 'parent_id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreCategories.name' => ['name' => 'name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreCategories.created >=' => ['name' => 'createdFrom', 'values' => []],
                'CoreCategories.modified <=' => ['name' => 'createdTo', 'values' => []],
                'CoreCategories.created >=' => ['name' => 'modifiedFrom', 'values' => []],
                'CoreCategories.modified <' => ['name' => 'modifiedTo', 'values' => []],
            ];

            $defaultPagination = [
                'limit' => ['name' => 'limit', 'min' => 1, 'max' => 100, 'default' => 100],
                'page' => ['name' => 'page', 'default' => 1]
            ];

            $requestParams = $this->request->query;
            
            $filter = $this->parseRequestFilter($requestParams, $defaultFilter);
            $pagination = $this->parseRequestPagination($requestParams, $defaultPagination);

            $categories = $this->CoreCategories->find('all')
                ->where($filter)
                ->limit($pagination['limit'])
                ->page($pagination['page']);
                
            $response = $this->{$this->responseFormatterComponent}->formatCatgories($categories);
        
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
     * @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $categories = $this->getRequest()->getData();
        foreach ($categories as $categoryData) {
            $categoryEntity = $this->CoreCategories->newEntity();
            $category = $this->CoreCategories->patchEntity($categoryEntity, $categoryData);
            $newCategory = $this->CoreCategories->save($category);
            if (!empty($category->errors())) {
                $errors = $category->errors();
                foreach ($errors as $columnName => $errorMessages) {
                    foreach ($errorMessages as $errorMessage) {
                        throw new \Exception (__($columnName . ': ' . $errorMessage));
                    }
                }
            }
        }
        $message = array('status' => 'success', 'message' => 'Categories Successfully Created');
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
            $categoryData = $this->getRequest()->getData();
            if ($this->CoreCategories->updateAll($categoryData, ['id' => $id])) {
                $message = array('status' => 'success', 'message' => 'Category Successfully Updated');
            } else {
                $message = array('status' => 'error', 'message' => 'The category could not be saved. Please, try again');
            }
            $this->set([
                'my_response' => $message,
                '_serialize' => 'my_response',
            ]);
            return $this->RequestHandler->renderAs($this, 'json');
        }
    }

    /**
     * Delete method
     *
     * @param string|null $id Category id.
     * @return \Cake\Http\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $category = $this->CoreCategories->get($id);
        if ($this->CoreCategories->delete($category)) {
            $message = array('status' => 'success', 'message' => 'The category has been deleted.');
        } else {
            $message = array('status' => 'error', 'message' => 'The category could not be deleted. Please, try again.');
        }
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');
    }
}
