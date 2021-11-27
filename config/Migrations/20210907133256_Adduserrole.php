<?php
use Migrations\AbstractMigration;

class Adduserrole extends AbstractMigration
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
        $core_user_roles = [
            [
                'id' => 2,
                'code' => 'user', 
                'name' => "User",

            ]
        ];
        if ($this->hasTable('core_user_roles')) {
            $this->table('core_user_roles')->insert($core_user_roles)->save();
        }

    }
}
