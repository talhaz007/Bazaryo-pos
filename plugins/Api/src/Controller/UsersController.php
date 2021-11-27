<?php
namespace Api\Controller;

use Api\Controller\AppController;
use Cake\Event\Event;

/**
 * Users Controller
 *
 *
 * @method \Api\Model\Entity\User[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class UsersController extends AppController
{
      
    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';
    
    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index', 'edit', 'add','delete']);
        $this->loadModel('ItoolCore.CoreUsers');
        $this->loadModel('ItoolCore.CoreUserRolesCoreUsers');
        
        $this->loadModel('ItoolCore.CoreAccounts');
        $this->loadModel('ItoolCore.CoreLanguages');
        $this->loadModel('UserBusinesses');
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
                'CoreUsers.id' => ['name' => 'id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.core_account_id' => ['name' => 'core_account_id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.core_language_id' => ['name' => 'core_language_id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.first_name' => ['name' => 'first_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.last_name' => ['name' => 'last_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.email' => ['name' => 'email', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.password' => ['name' => 'password', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.company_name' => ['name' => 'company_name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.street_line_1' => ['name' => 'street_line_1', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.street_line_2' => ['name' => 'street_line_2', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.city' => ['name' => 'city', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.postal_code' => ['name' => 'postal_code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreUsers.phone_number' => ['name' => 'phone_number', 'values' => [], 'multipleDelimiter' => ','],               
                'CoreUsers.created >=' => ['name' => 'createdFrom', 'values' => []],
                'CoreUsers.modified <=' => ['name' => 'createdTo', 'values' => []],
                'CoreUsers.created >=' => ['name' => 'modifiedFrom', 'values' => []],
                'CoreUsers.modified <' => ['name' => 'modifiedTo', 'values' => []],
            ];

            $defaultPagination = [
                'limit' => ['name' => 'limit', 'min' => 1, 'max' => 100, 'default' => 100],
                'page' => ['name' => 'page', 'default' => 1]
            ];

            $requestParams = $this->request->query;

            
            $filter = $this->parseRequestFilter($requestParams, $defaultFilter);
            
            $pagination = $this->parseRequestPagination($requestParams, $defaultPagination);

            $users = $this->CoreUsers->find('all')
                ->select(['UserBusinesses.cnic']) 
                ->join([
                    'UserBusinesses' => [
                        'table' => 'user_businesses',
                        'type' => 'INNER',
                        'conditions' => [
                            'UserBusinesses.core_user_id  = CoreUsers.id',
                        ],
                    ]
                ])
                ->where($filter)
                ->limit($pagination['limit'])
                ->page($pagination['page'])
                ->autoFields(true);
              
            $response = $this->{$this->responseFormatterComponent}->formatUsers($users);
        
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
        if ($this->request->is(['patch', 'post', 'put'])) {
            $users = $this->getRequest()->getData();
           
            $userEntity = $this->CoreUsers->newEntity();
            $user = $this->CoreUsers->patchEntity($userEntity, $users);
            try {
                $newUser = $this->CoreUsers->save($user);
            } catch (\Exception $exp) {
                dd($exp);
            }
            $newCoreUserRoleEntity = $this->CoreUserRolesCoreUsers->newEntity();
            $newCoreUserRole['core_user_role_id']= 2;
            $newCoreUserRole['core_user_id'] = $newUser->id;
            $user = $this->CoreUserRolesCoreUsers->patchEntity($newCoreUserRoleEntity, $newCoreUserRole);
            $this->CoreUserRolesCoreUsers->save($user);
            $newCoreUserBusinessEntity = $this->UserBusinesses->newEntity();
            $newCoreUserBusiness['name']= $users['name'];
            $newCoreUserBusiness['cnic'] = $users['cnic'];
            $newCoreUserBusiness['core_user_id'] = $newUser->id;
            $userBusiness = $this->UserBusinesses->patchEntity($newCoreUserBusinessEntity, $newCoreUserBusiness);
            $this->UserBusinesses->save($userBusiness);
            if (!empty($user->errors())) {
                $errors = $user->errors();
                foreach ($errors as $columnName => $errorMessages) {
                    foreach ($errorMessages as $errorMessage) {
                        throw new \Exception (__($columnName . ': ' . $errorMessage));
                    }
                }
            }
        $message = array('status' => 'success', 'message' => 'User Successfully Created');
        $this->set([
            'my_response' => $message,
            '_serialize' => 'my_response',
        ]);
        return $this->RequestHandler->renderAs($this, 'json');
        }
        exit;
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
            $usersData = $this->getRequest()->getData();
            foreach ($usersData as $userData) {
            $id = $userData['id'];            
            $user = $this->CoreUsers->get($id, [
                'contain' => []
            ]);            
            $user->core_language_id = $userData['core_language_id'];
            $user->first_name = $userData['first_name'];
            $user->last_name = $userData['last_name'];
            $user->email = $userData['email'];            
            $user->company_name = $userData['company_name'];
            $user->street_line_1 = $userData['street_line_1'];
            $user->street_line_2 = $userData['street_line_2'];
            $user->city = $userData['city'];
            $user->postal_code = $userData['postal_code'];
            $user->phone_number = $userData['phone_number'];            
            $userBusiness['name'] = $userData['name'];
            $userBusiness['cnic'] = $userData['cnic'];            
            if ($this->CoreUsers->save($user)) {
                $this->UserBusinesses->updateAll($userBusiness, ['core_user_id' => $id]);
                $message = array('status' => 'success', 'message' => 'User Successfully Updated');
            } else {
                $message = array('status' => 'error', 'message' => 'The User could not be saved. Please, try again');
            }
            }
            $this->set([
                'my_response' => $message,
                '_serialize' => 'my_response',
            ]);
            return $this->RequestHandler->renderAs($this, 'json');
        }
        exit();
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
        $user = $this->CoreUsers->get($id);
        if ($this->CoreUsers->delete($user)) {
            $this->Flash->success(__('The user has been deleted.'));
        } else {
            $this->Flash->error(__('The user could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
}
