<?php

namespace Api\Controller;

use Api\Controller\AppController;
use Cake\Event\Event;
use Firebase\JWT\JWT;
use Cake\Core\Configure;
use Cake\Routing\Router;


/**
 * @method 
 */
class LoginController extends AppController
{
    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index']);
        $this->loadModel('ItoolCore.CoreUsers');
        $this->loadModel('ItoolCore.CoreAccounts');
        $this->loadComponent($this->pluginName . '.' . $this->responseFormatterComponent);
    }

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Security->setConfig('unlockedActions', ['index']);
    }

    public function index()
    {
        if ($this->getRequest()->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $coreUser = $this->CoreUsers->find()
                    ->where([
                        'CoreUsers.id' => $user['id'],
                        'CoreUsers.is_deleted' => false
                    ])
                    ->first();
                $this->Auth->setUser($coreUser);
                
                $issTimestamp = strtotime("yesterday");
                $expTimestamp = strtotime("tomorrow");
                
                $siteUrl = Router::fullbaseUrl();
                $payload = array(
                    "iss" => $siteUrl,
                    "aud" => $siteUrl,
                    "iat" => $issTimestamp,
                    "nbf" => $expTimestamp
                );
                $jwtKey = configure::read('jwtKey');
                $jwt = JWT::encode($payload, $jwtKey);
                $tokenData = [
                    'id' => $user['id'],
                    'token' => $jwt
                ];
                $response= $tokenData ;
                $this->set([
                    'my_response' => $response,
                    '_serialize' => 'my_response',
                ]);
                return $this->RequestHandler->renderAs($this, 'json');
            } else {
                $message= "Invalid Email or Password";
                $this->set([
                    'my_response' => $message,
                    '_serialize' => 'my_response',
                ]);
                return $this->RequestHandler->renderAs($this, 'json');
            }
        }
        exit;
    }
}
