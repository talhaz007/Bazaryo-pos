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
class CountriesController extends AppController
{
    
    protected $pluginName = 'Api';
    protected $responseFormatterComponent = 'ResponseFormatter';
    
    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['index']);
        $this->loadModel('ItoolCore.CoreCountries');
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
                'CoreCountries.id' => ['name' => 'id', 'values' => [], 'multipleDelimiter' => ','],
                'CoreCountries.name' => ['name' => 'name', 'values' => [], 'multipleDelimiter' => ','],
                'CoreCountries.code' => ['name' => 'code', 'values' => [], 'multipleDelimiter' => ','],
                'CoreCountries.created >=' => ['name' => 'createdFrom', 'values' => []],
                'CoreCountries.modified <=' => ['name' => 'createdTo', 'values' => []],
                'CoreCountries.created >=' => ['name' => 'modifiedFrom', 'values' => []],
                'CoreCountries.modified <' => ['name' => 'modifiedTo', 'values' => []],
            ];

            $defaultPagination = [
                'limit' => ['name' => 'limit', 'min' => 1, 'max' => 100, 'default' => 100],
                'page' => ['name' => 'page', 'default' => 1]
            ];

            $requestParams = $this->request->query;
            
            $filter = $this->parseRequestFilter($requestParams, $defaultFilter);
            $pagination = $this->parseRequestPagination($requestParams, $defaultPagination);

            $countries = $this->CoreCountries->find('all')
                ->where($filter)
                ->limit($pagination['limit'])
                ->page($pagination['page']);
                
            $response = $this->{$this->responseFormatterComponent}->formatCountries($countries);
        
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
