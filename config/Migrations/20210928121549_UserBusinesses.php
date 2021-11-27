<?php
use Migrations\AbstractMigration;

class UserBusinesses extends AbstractMigration
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
        $table = $this->table('user_businesses');
        if (!$table->exists()) {
            $table
                ->addColumn('name', 'string', ['null' => true, 'default' => null, ])
                ->addColumn('cnic', 'string', ['null' => true, 'default' => null, ])
                ->addColumn('core_user_id', 'integer', ['limit' => 10,'null' => true, 'default' => null, ])
                ->addForeignKey('core_user_id',
                'core_users', 'id', ['delete' => 'CASCADE'])  
                ->addColumn('created', 'datetime', [
                    'default' => null,
                    'null' => false,
                ])
                ->addColumn('modified', 'datetime', [
                    'default' => null,
                    'null' => false,
                ])  
                ->create();
        }
    }
}
