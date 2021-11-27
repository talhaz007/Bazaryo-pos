<?php
use Migrations\AbstractMigration;

class AddMarketPlaces extends AbstractMigration
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
        $core_marketplaces = [
            [
                'code' => 'default', 
                'name' => "Default",

            ]
        ];
        if ($this->hasTable('core_marketplaces')) {
            $this->table('core_marketplaces')->insert($core_marketplaces)->save();
        }

    }
}
