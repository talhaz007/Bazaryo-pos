<?php
namespace Api\Controller;

use Api\Controller\AppController;
use Cake\Event\Event;
use Api\Controller\Component\ResponseFormatterComponent;

class SubscriptionController extends AppController
{
    
    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';
    
    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index']);
        $this->loadModel('ItoolCore.ApiUsers');
        $this->loadComponent($this->pluginName.'.'.$this->responseFormatterComponent);
    }
    
    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Security->setConfig('unlockedActions', ['index']);
    }
    
    /**
     * Index method
     *
     * @return \Cake\Http\Response|null
     */
    public function index()
    {
        $response = "Subscribed";
        $status = 'Success';
  
        $this->set([
			'my_response' => $response,
			'_serialize' => 'my_response',
		]);
        return $this->RequestHandler->renderAs($this, 'json');
    }
}
