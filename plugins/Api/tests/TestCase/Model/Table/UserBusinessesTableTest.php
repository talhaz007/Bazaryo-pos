<?php
namespace Api\Test\TestCase\Model\Table;

use Api\Model\Table\UserBusinessesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * Api\Model\Table\UserBusinessesTable Test Case
 */
class UserBusinessesTableTest extends TestCase
{
    /**
     * Test subject
     *
     * @var \Api\Model\Table\UserBusinessesTable
     */
    public $UserBusinesses;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'plugin.Api.UserBusinesses',
        'plugin.Api.CoreUsers',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::getTableLocator()->exists('UserBusinesses') ? [] : ['className' => UserBusinessesTable::class];
        $this->UserBusinesses = TableRegistry::getTableLocator()->get('UserBusinesses', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->UserBusinesses);

        parent::tearDown();
    }

    /**
     * Test initialize method
     *
     * @return void
     */
    public function testInitialize()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testValidationDefault()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test buildRules method
     *
     * @return void
     */
    public function testBuildRules()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
