<?php

namespace Api\Controller;

use App\Controller\AppController as BaseController;
use Cake\Cache\Cache;
use Cake\Event\Event;
use Cake\Utility\Xml;
use Cake\Utility\Inflector;
use ItoolCore\Model\Table\CoreAccountTypesTable;
use Cake\Core\Configure;
use Firebase\JWT\JWT;

class AppController extends BaseController
{
    protected $apiUser;
    protected $responseFormats = ['xml', 'json'];
    protected $responseFormat = 'xml';

    public function beforeFilter(Event $event)
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, API-AUTH-TOKEN, API-RESPONSE-FORMAT");
        $whiteList = ['Login','Token','Users', 'ApiJobs', 'ApiUsers', 'ApiJobStatuses', 'ApiFeeds', 'ApiUserRequestLogs', 'ApiJobErrors', 'ApiFeedTypes'];

        if (!in_array($event->getSubject()->request->params['controller'], $whiteList)) {
            $apiAuthToken = $this->request->getHeaderLine('API-AUTH-TOKEN');
            $responseOutputFormat = strtolower(trim($this->request->getHeaderLine('API-RESPONSE-FORMAT')));

            if (in_array($responseOutputFormat, $this->responseFormats)) {
                $this->responseFormat = $responseOutputFormat;
            }

            try {
                $jwtKey = configure::read('jwtKey');
                /*$decoded = JWT::decode($apiAuthToken, $jwtKey, array('HS256'));
                
                if (empty($apiUser->api_user_identifier_id)) {
                    throw new \Exception('Invalid Api Auth Token');
                }*/
            } catch (\Exception $exp) {

                $response['Error'][] = [
                    'Message' => $exp->getMessage()
                ];
                $status = 'Failure';

                $this->formatResponse($response, $status);
                exit;
            }
        } else {
            parent::beforeFilter($event);
        }
        return true;
    }

    protected function parseRequestFilter($requestFilter, $defaultFilter)
    {
        $filter = [];
        foreach ($defaultFilter as $key => $params) {
            if (isset($requestFilter[$params['name']]) &&
                (!isset($params['min']) || $requestFilter[$params['name']] >= $params['min']) &&
                (!isset($params['max']) || $requestFilter[$params['name']] <= $params['max'])
            ) {
                if ((isset($params['values']) && !empty($params['values']) && !in_array($requestFilter[$params['name']], $params['values']))) {
                    throw new \Exception('Not allowed value "' . $requestFilter[$params['name']] . '" for "' . $params['name'] . '". Please provide one of the following values: (' . implode(',', $params['values']) . ')');
                }
                if(!empty($requestFilter[$params['name']])) {
                    if (isset($params['multipleDelimiter'])) {
                        $filter[$key . ' IN'] = array_map('trim', explode($params['multipleDelimiter'], $requestFilter[$params['name']]));
                    } else {
                        $filter[$key] = $requestFilter[$params['name']];
                    }

                }
            } else {
                if (isset($params['default'])) {
                    $filter[$key] = $params['default'];
                }
            }
        }
        return $filter;
    }

    protected function parseRequestPagination($requestFilter, $defaultPagination)
    {
        $pagination = [];
        foreach ($defaultPagination as $key => $params) {
            if (isset($requestFilter[$params['name']]) &&
                (!isset($params['min']) || $requestFilter[$params['name']] >= $params['min']) &&
                (!isset($params['max']) || $requestFilter[$params['name']] <= $params['max'])
            ) {
                $pagination[$key] = $requestFilter[$params['name']];
            } else {
                if (isset($params['default'])) {
                    $pagination[$key] = $params['default'];
                }
            }
        }
        return $pagination;
    }

    protected function formatResponse($response, $status)
    {
        $fullResponse = [
            'Response' => [
                'Status' => $status,
            ]
        ];
        if (!empty($response)) {
            if (strtolower($status) == 'success') {
                $fullResponse['Response']['Result'] = $response;
            } else {
                $fullResponse['Response']['Errors'] = $response;
            }
        }
        switch ($this->responseFormat) {
            case 'xml' :
                echo Xml::fromArray($fullResponse)->asXML();
                break;
            case 'json' :
                echo json_encode($fullResponse);
                break;
        }
        exit;
    }

    protected function arrayToCamelCaseRecursive($input, $formattedResponse = null)
    {
        foreach ($input as $responseKey => $responseValue) {
            if (is_array($responseValue)) {
                $responseValue = $this->arrayToCamelCaseRecursive($responseValue, $formattedResponse);
            }
            $formattedResponse[Inflector::camelize($responseKey)] = $responseValue;
        }
        return $formattedResponse;
    }
}
