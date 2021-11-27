<?php
namespace Api\Test\TestCase\Controller\Component;

use Api\Controller\Component\ResponseFormatterComponent;
use Cake\Controller\ComponentRegistry;
use Cake\TestSuite\TestCase;

/**
 * Api\Controller\Component\ResponseFormatterComponent Test Case
 */
class ResponseFormatterComponentTest extends TestCase
{
    /**
     * Test subject
     *
     * @var \Api\Controller\Component\ResponseFormatterComponent
     */
    public $ResponseFormatter;

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $registry = new ComponentRegistry();
        $this->ResponseFormatter = new ResponseFormatterComponent($registry);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ResponseFormatter);

        parent::tearDown();
    }

    /**
     * Test initial setup
     *
     * @return void
     */
    public function testInitialization()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
