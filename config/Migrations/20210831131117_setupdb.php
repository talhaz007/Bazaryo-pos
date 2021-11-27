<?php
use Migrations\AbstractMigration;
use Phinx\Db\Adapter\MysqlAdapter;

class Setupdb extends AbstractMigration
{
    /**
     * Change Method.
     *
     * More information on this method is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     * @return void
     */
    public function change()
    {
        $table = $this->table('cities');
        if (!$table->exists()) {
            $table
                ->addColumn('name', 'string', ['limit' => 255])
                ->addColumn('state_id', 'integer', ['limit' => 10])
                ->addColumn('active', 'integer', ['limit' => 10])
                ->create();

        }
        $table = $this->table('states');
        if (!$table->exists()) {
            $table
                ->addColumn('name', 'string', ['limit' => 255])
                ->addColumn('country_id', 'integer', ['limit' => 10])
                ->addColumn('active', 'integer', ['limit' => 10])
                ->create();

        }
    }
}
