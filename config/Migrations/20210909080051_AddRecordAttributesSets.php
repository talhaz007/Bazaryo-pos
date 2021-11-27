<?php
use Migrations\AbstractMigration;

class AddRecordAttributesSets extends AbstractMigration
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
        $core_product_eav_attribute_sets = [
            [
                'core_account_id' => 1,
                'code' => 'default', 
                'name' => "Default",

            ]
        ];
        if ($this->hasTable('core_product_eav_attribute_sets')) {
            $this->table('core_product_eav_attribute_sets')->insert($core_product_eav_attribute_sets)->save();
        }
}
}
