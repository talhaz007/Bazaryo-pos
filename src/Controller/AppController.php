<?php
/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link      https://cakephp.org CakePHP(tm) Project
 * @since     0.2.9
 * @license   https://opensource.org/licenses/mit-license.php MIT License
 */
namespace App\Controller;

use Cake\Controller\Controller;
use Cake\Core\Configure;
use Cake\Event\Event;
use Cake\I18n\I18n;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link https://book.cakephp.org/3/en/controllers.html#the-app-controller
 */
class AppController extends Controller
{
    /** @var bool */
    public $isFrontend;

    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('Security');`
     *
     * @return void
     */
    public function initialize()
    {
        //$this->isFrontend = true;

        parent::initialize();

        $this->loadComponent('RequestHandler', [
            'enableBeforeRedirect' => false,
        ]);
        $this->loadComponent('Acl.Acl');
        $this->loadComponent('Flash');
        $this->loadComponent('Security', ['blackHoleCallback' => 'forceSSL']);
        $this->loadComponent('Auth', [
            'loginAction' => [
                'controller' => 'CoreUsers',
                'action' => 'login',
                'admin' => false,
                'plugin' => 'ItoolCore'
            ],
            'authorize' => [
                'ItoolAclManager.ActionsMulti' => [
                    'actionPath' => null,
                    'userModel' => 'ItoolCore\Model\Table\CoreUsersTable'
                ]
            ],
            'authError' => __('Unfortunately the authentication has failed.'),
            'authenticate' => [
                'Form' => [
                    'userModel' => 'ItoolCore.CoreUsers',
                    'fields' => [
                        'username' => 'email'
                    ]
                ]
            ],
            'loginRedirect' => [
                'controller' => 'Dashboards',
                'action' => 'index',
                'admin' => false,
                'plugin' => 'ItoolDashboard'
            ],
            'logoutRedirect' => [
                'controller' => 'CoreUsers',
                'action' => 'login',
                'admin' => false,
                'plugin' => 'ItoolCore'
            ]
        ]);
        /*
         * Enable the following component for recommended CakePHP security settings.
         * see https://book.cakephp.org/3.0/en/controllers/components/security.html
         */
        //$this->loadComponent('Security');
    }
    public function beforeRender(Event $event)
    {
        parent::beforeRender($event);
        if (isset($this->isFrontend) || $this->isFrontend ) {
            
            $this->viewBuilder()->setTheme(Configure::read('frontendTheme'));
        } else {
            $this->viewBuilder()->setTheme(Configure::read('backendTheme'));
        }
    }
    public function beforeFilter(Event $event)
    {
        if (Configure::read('forceSSL')) {
            $this->forceSSL();
            $this->Security->requireSecure();
        }
        if (isset($this->Csrf)) {
            if (in_array($this->request->action, array('twigTest'))) {
                $this->getEventManager()->off($this->Csrf);
            }
        }
        $this->Auth->allow(['display','displayPage']);
        $this->currentUser = $this->Auth->user();
        $this->set('authUser', $this->Auth->user());
    }

    private function setUserLocale()
    {
        $languageCode = $this->getRequest()->getSession()->read('user_language_code');
        if (!empty($languageCode)) {
            I18n::setLocale($languageCode);
        }
    }

    protected function setUserLanguage($languageCode)
    {
        $this->getRequest()->getSession()->write('user_language_code', $languageCode);
    }
    public function forceSSL()
    {
        // internet explorer POST requests are redirected to the same page if we don't do this check
        if ($this->getRequest()->scheme() !== 'https') {
            return $this->redirect('https://' . env('SERVER_NAME') . $this->getRequest()->getUri()->getPath());
        }
    }
}
