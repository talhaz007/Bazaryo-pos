<?php
namespace Api\Controller\Component;

use Cake\Controller\Component;
use Cake\Controller\ComponentRegistry;

/**
 * ResponseFormatter component
 */
class ResponseFormatterComponent extends Component
{
    /**
     * Default configuration.
     *
     * @var array
     */
    protected $_defaultConfig = [];
    
    public function formatCatgories($categories)
    {
        $formatedCategories = [];
        foreach ($categories as $category) {
            $formatedCategory['id'] = $category->id;
            $formatedCategory['parent_id'] = $category->parent_id;
            $formatedCategory['name'] = $category->name;
            $formatedCategory['description'] = $category->description;
            $formatedCategory['meta_description'] = $category->meta_description;
            $formatedCategory['created'] = $category->created;
            $formatedCategory['modified'] = $category->modified;
            $formatedCategories[] = $formatedCategory;
        }
        return $formatedCategories;
    }

    public function formatCustomers($customers)
    {
        $formatedCustomers = [];
        foreach ($customers as $customers) {
            $formatedCustomer['id'] = $customers->id;
            $formatedCustomer['core_language_id'] = $customers->core_language_id;
            $formatedCustomer['first_name'] = $customers->first_name;
            $formatedCustomer['last_name'] = $customers->last_name;
            $formatedCustomer['email'] = $customers->email;
            $formatedCustomer['password'] = $customers->password;
            $formatedCustomer['address'] = $this->getCustomerAddresses($customers->customer_addresses);
            $formatedCustomer['created'] = $customers->created;
            $formatedCustomer['modified'] = $customers->modified;
            $formatedCustomers[] = $formatedCustomer;
        }
        return $formatedCustomers;
    }
   
    public function getCustomerAddresses($addresses)
    {
        foreach ($addresses as $address) {
            $customerAddresses['core_country_id'] = $address->core_country_id;
            $customerAddresses['core_language_id'] = $address->core_language_id;
            $customerAddresses['company'] = $address->company;
            $customerAddresses['street_line_2'] = $address->street_line_2;
            $customerAddresses['street_line_1'] = $address->street_line_1;
            $customerAddresses['city'] = $address->city;
            $customerAddresses['postal_code'] = $address->postal_code;
            $customerAddresses['phone_number'] = $address->phone_number;
        }
        return $customerAddresses;
    }

    public function formatCountries($countries)
    {
        $formatedCountries = [];
        foreach ($countries as $country) {
            $formatCountries['id'] = $country->id;
            $formatCountries['parent_id'] = $country->parent_id;
            $formatCountries['name'] = $country->name;
            $formatCountries['created'] = $country->created;
            $formatCountries['modified'] = $country->modified;
            $formatedCountries[] = $formatCountries;
        }
        return $formatedCountries;
    }

    public function formatLanguages($languages)
    {
        $formatedLanguages = [];
        foreach ($languages as $language) {
            $formatLanguages['id'] = $language->id;
            $formatLanguages['parent_id'] = $language->parent_id;
            $formatLanguages['name'] = $language->name;
            $formatLanguages['created'] = $language->created;
            $formatLanguages['modified'] = $language->modified;
            $formatedLanguages[] = $formatLanguages;
        }
        return $formatedLanguages;
    }

    public function formatapiuser($apiusers)
    {
        $formatedapiusers = [];
        foreach ($apiusers as $apiuser) {
            $formatedapiusers['token'] = $apiuser->token;
            $formatedapiusers[] = $formatedapiusers;
        }
        return $formatedapiusers;
    }
    
    public function formatUsers($users)
    {

        $formatedUsers = [];
        foreach ($users as $user) {           
            $formatedUser['id'] = $user->id;
            $formatedUser['core_account_id'] = $user->core_account_id;
            $formatedUser['core_language_id'] = $user->core_language_id;
            $formatedUser['first_name'] = $user->first_name;
            $formatedUser['last_name'] = $user->last_name;
            $formatedUser['email'] = $user->email;
            $formatedUser['password'] = $user->email;            
            $formatedUser['password'] = $user->password;
            $formatedUser['company_name'] = $user->company_name;
            $formatedUser['street_line_1'] = $user->street_line_1;
            $formatedUser['street_line_2'] = $user->street_line_2;
            $formatedUser['city'] = $user->city;
            $formatedUser['postal_code'] = $user->postal_code;
            $formatedUser['phone_number'] = $user->phone_number;
            $formatedUser['cnic'] = $user->UserBusinesses['cnic'];
            $formatedUser['created'] = $user->created;
            $formatedUser['modified'] = $user->modified;
            $formatedUsers[] = $formatedUser;
        }       
        return $formatedUsers;
    }

    public function formatProducts($products)
    {
        $formatedProducts = [];
        foreach ($products as $product) {
            $formatedProduct['id'] = $product->id;
            $formatedProduct['core_account_id'] = $product->core_account_id;
            $formatedProduct['core_marketplace_id'] = $product->core_marketplace_id;
            $formatedProduct['core_product_type_id'] = $product->core_product_type_id;
            $formatedProduct['core_product_eav_attribute_set_id'] = $product->core_product_eav_attribute_set_id;
            $formatedProduct['parent_id '] = $product->parent_id ;
            $formatedProduct['sku'] = $product->sku;
            $formatedProduct['created'] = $product->created;
            $formatedProduct['modified'] = $product->modified;
            $formatedProducts[] = $formatedProduct;
        }
        return $formatedProducts;
    }

    public function formatAddresses($addresses)
    {
        //Address
        $formatedAddresses = [];
        foreach ($addresses as $address) {
            $formatedAddress['id'] = $address->id;
            $formatedAddress['customer_id'] = $address->customer_id;
            $formatedAddress['core_country_id'] = $address->core_country_id;
            $formatedAddress['first_name'] = $address->first_name;
            $formatedAddress['last_name'] = $address->last_name;
            $formatedAddress['company'] = $address->company;
            $formatedAddress['street_line_1'] = $address->street_line_1;
            $formatedAddress['street_line_2'] = $address->street_line_2;
            $formatedAddress['city'] = $address->city;
            $formatedAddress['postal_code'] = $address->postal_code;
            $formatedAddress['phone_number'] = $address->phone_number;
            $formatedAddress['created'] = $address->created;
            $formatedAddress['modified'] = $address->modified;
            $formatedAddresses[] = $formatedAddress;
        }
        return $formatedAddresses;
    }
    public function formatOrders($orders)
    {
        $formatedOrders = [];
        foreach ($orders as $order) {            
            $formatedOrder['id'] = $order->id;
            $formatedOrder['core_user_id'] = $order->core_user_id;
            $formatedOrder['customer_id'] = $order->customer_id;
            $formatedOrder['core_account_id'] = $order->core_account_id;
            $formatedOrder['language_code'] = $order->language_code;
            $formatedOrder['state_name'] = $order->state_name;
            $formatedOrder['status_name'] = $order->status_name;
            $formatedOrder['customer_title'] = $order->customer_title;
            $formatedOrder['customer_firstname'] = $order->customer_firstname;
            $formatedOrder['customer_lastname'] = $order->customer_lastname;
            $formatedOrder['customer_company'] = $order->customer_company;
            $formatedOrder['customer_email'] = $order->customer_email;
            $formatedOrder['customer_phone'] = $order->customer_phone;
            $formatedOrder['customer_street_1'] = $order->customer_street_1;
            $formatedOrder['customer_street_2'] = $order->customer_street_2;
            $formatedOrder['customer_postcode'] = $order->customer_postcode;
            $formatedOrder['customer_country_code'] = $order->customer_country_code;
            $formatedOrder['customer_country_name'] = $order->customer_country_name;
            $formatedOrder['shipping_firstname'] = $order->shipping_firstname;
            $formatedOrder['shipping_lastname'] = $order->shipping_lastname;
            $formatedOrder['shipping_company'] = $order->shipping_company;
            $formatedOrder['shipping_street_1'] = $order->shipping_street_1;
            $formatedOrder['shipping_street_2'] = $order->shipping_street_2;
            $formatedOrder['shipping_postcode'] = $order->shipping_postcode;
            $formatedOrder['shipping_city'] = $order->shipping_city;
            $formatedOrder['shipping_country_code'] = $order->shipping_country_code;
            $formatedOrder['shipping_country_name'] = $order->shipping_country_name;
            $formatedOrder['invoice_firstname'] = $order->invoice_firstname;
            $formatedOrder['invoice_lastname'] = $order->invoice_lastname;
            $formatedOrder['invoice_company'] = $order->invoice_company;
            $formatedOrder['invoice_street_1'] = $order->invoice_street_1;
            $formatedOrder['invoice_street_2'] = $order->invoice_street_2;
            $formatedOrder['invoice_postcode'] = $order->invoice_postcode;
            $formatedOrder['invoice_city'] = $order->invoice_city;
            $formatedOrder['invoice_country_code'] = $order->invoice_country_code;
            $formatedOrder['invoice_country_name'] = $order->invoice_country_name;
            $formatedOrder['currency_code'] = $order->currency_code;
            $formatedOrder['currency_name'] = $order->currency_name;
            $formatedOrder['payment_method_name'] = $order->payment_method_name;
            $formatedOrder['shipping_method_name'] = $order->shipping_method_name;
            $formatedOrder['external_purchase_date'] = $order->external_purchase_date;
            $formatedOrder['core_marketplace_code'] = $order->core_marketplace_code;
            $formatedOrder['core_marketplace_name'] = $order->core_marketplace_name;            
            $formatedOrder['account_name'] = $order->account_name;
            $formatedOrder['external_order_identifier'] = $order->external_order_identifier;
            $formatedOrder['external_customer_identifier'] = $order->external_customer_identifier;
            $formatedOrder['marketplace_code'] = $order->marketplace_code;
            $formatedOrder['marketplace_group_code'] = $order->marketplace_group_code;
            $formatedOrder['account_code'] = $order->account_code;
            $formatedOrder['payment_method_code'] = $order->payment_method_code;
            $formatedOrder['shipping_method_code'] = $order->shipping_method_code;
            $formatedOrder['state_code'] = $order->state_code;
            $formatedOrder['status_code'] = $order->status_code;
            $formatedOrder['purchase_date'] = $order->purchase_date;
            $formatedOrder['modified'] = $order->modified;
            $formatedOrders[] = $formatedOrder;
        }
        return $formatedOrders;
    }
}
