<?php
use Migrations\AbstractMigration;

class AddImageToCoreProductEavAttributes extends AbstractMigration
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
        $attributes = [
            [
                'core_account_id' => 1,
                'code' => 'profile', 
                'name' => "Profile",
                'data_type' => "varchar",
            ]
        ];
        if ($this->hasTable('core_product_eav_attributes')) {
            $this->table('core_product_eav_attributes')->insert($attributes)->save();
        }
    }
}
