<?php
use Migrations\AbstractMigration;

class AddCatgories extends AbstractMigration
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
        $categories = [
            [
                'parent_id' => 0,
                'core_account_id' => 1,
                'name' => 'home',
                'description' => 'home',
                'lft' => 0,
                'rght' => 0
            ],
            [
                'parent_id' => 1,
                'core_account_id' => 1,
                'name' => 'test',
                'description' => 'test',
                'lft' => 0,
                'rght' => 0
            ],
            [
                'parent_id' => 1,
                'core_account_id' => 1,
                'name' => 'test2',
                'description' => 'test2',
                'lft' => 0,
                'rght' => 0
            ]
        ];
        if ($this->hasTable('core_categories')) {
            $this->table('core_categories')->insert($categories)->save();
        }
    }
}
