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
class LanguagesController extends AppController
{
    
    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';
    
    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index']);
        $this->loadModel('ItoolCore.CoreLanguages');
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
        $response = null;
        $status = 'Success';

        try {
            $defaultFilter = [
                'CoreLanguages.id' => ['name' => 'id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreLanguages.name' => ['name' => 'name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreLanguages.code' => ['name' => 'code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreLanguages.created >=' => ['name' => 'createdFrom', 'values' => []],
                'CoreLanguages.modified <=' => ['name' => 'createdTo', 'values' => []],
                'CoreLanguages.created >=' => ['name' => 'modifiedFrom', 'values' => []],
                'CoreLanguages.modified <' => ['name' => 'modifiedTo', 'values' => []],
            ];

            $defaultPagination = [
                'limit' => ['name' => 'limit', 'min' => 1, 'max' => 100, 'default' => 100],
                'page' => ['name' => 'page', 'default' => 1]
            ];

            $requestParams = $this->request->query;
            
            $filter = $this->parseRequestFilter($requestParams, $defaultFilter);
            $pagination = $this->parseRequestPagination($requestParams, $defaultPagination);

            $languages = $this->CoreLanguages->find('all')
                ->where($filter)
                ->limit($pagination['limit'])
                ->page($pagination['page']);
                
            $response = $this->{$this->responseFormatterComponent}->formatLanguages($languages);
        
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
}
