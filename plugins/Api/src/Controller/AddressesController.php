<?php
namespace Api\Controller;

use Api\Controller\AppController;
use Cake\Event\Event;
/**
 * Addresses Controller
 *
 *
 * @method \Api\Model\Entity\Address[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class AddressesController extends AppController
{

    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index', 'edit', 'add','delete']);
        $this->loadModel('ItoolCore.CustomerAddresses');
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
                'CustomerAddresses.id' => ['name' => 'id', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.customer_id' => ['name' => 'customer_id', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.core_country_id	' => ['name' => 'core_country_id', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.first_name' => ['name' => 'first_name', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.last_name' => ['name' => 'last_name', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.company' => ['name' => 'company', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.street_line_1' => ['name' => 'street_line_1', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.street_line_2' => ['name' => 'street_line_2', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.city' => ['name' => 'city', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.postal_code' => ['name' => 'postal_code', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.phone_number' => ['name' => 'phone_number', 'values' => [], 'multipleDelimiter' => ','],
                'CustomerAddresses.created >=' => ['name' => 'createdFrom', 'values' => []],
                'CustomerAddresses.modified <=' => ['name' => 'createdTo', 'values' => []],
                'CustomerAddresses.created >=' => ['name' => 'modifiedFrom', 'values' => []],
                'CustomerAddresses.modified <' => ['name' => 'modifiedTo', 'values' => []],
            ];

            $defaultPagination = [
                'limit' => ['name' => 'limit', 'min' => 1, 'max' => 100, 'default' => 100],
                'page' => ['name' => 'page', 'default' => 1]
            ];

            $requestParams = $this->request->query;

            $filter = $this->parseRequestFilter($requestParams, $defaultFilter);
            $pagination = $this->parseRequestPagination($requestParams, $defaultPagination);

            $addresses = $this->CustomerAddresses->find('all')
                ->where($filter)
                ->limit($pagination['limit'])
                ->page($pagination['page']);

            $response = $this->{$this->responseFormatterComponent}->formatAddresses($addresses);

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
     * @param string|null $id User id.
     * @return \Cake\Http\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($id = null)
    {
        $user = $this->Users->get($id, [
            'contain' => [],
        ]);

        $this->set('user', $user);
    }

    /**
     * Add method
     *
     * @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $addresses = $this->getRequest()->getData();
        $addressEntity = $this->CustomerAddresses->newEntity();
        $address = $this->CustomerAddresses->patchEntity($addressEntity, $addresses);
        $newaddress = $this->CustomerAddresses->save($address);
        if (!empty($address->errors())) {
            $errors = $address->errors();
            foreach ($errors as $columnName => $errorMessages) {
                foreach ($errorMessages as $errorMessage) {
                    throw new \Exception (__($columnName . ': ' . $errorMessage));
                }
            }
        }
        $message = array('status' => 'success', 'message' => 'Addresses Successfully Added');
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');
    }

    /**
     * Edit method
     *
     * @param string|null $id User id.
     * @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit($id = null)
    {
        if ($this->request->is(['patch', 'post', 'put'])) {
            $addressData = $this->getRequest()->getData();
            if ($this->CustomerAddresses->updateAll($addressData, ['id' => $id])) {
                $message = array('status' => 'success', 'message' => 'Addresses Successfully Updated');
            } else {
                $message = array('status' => 'error', 'message' => 'The Addresses could not be saved. Please, try again');
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
     * @param string|null $id User id.
     * @return \Cake\Http\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $address = $this->CustomerAddresses->get($id);
        if ($this->CustomerAddresses->delete($address)) {
            $this->Flash->success(__('The user has been deleted.'));
        } else {
            $this->Flash->error(__('The user could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
} 