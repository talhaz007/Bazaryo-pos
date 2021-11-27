<?php
namespace App\View\Helper;

use Cake\View\Helper;
use Cake\View\View;

/**
 * Sidebar helper
 */
class SidebarHelper extends Helper
{

    /**
     * Default configuration.
     *
     * @var array
     */
    protected $_defaultConfig = [];

    /**
     * Remove sidebar menu if ACL permission is false
     *
     * @param $sidebar
     * @param $permissions
     * @return mixed
     */


    public function removeMenu($menu, $permissions)
    {
        foreach($menu as $sortOrder => $menuData) {
            foreach($menuData['links'] as $key => $subMenu) {
                if(isset($subMenu['link'])) {
                    $controllerAction = "";
                    if (isset($subMenu['link']['prefix']) && !empty($subMenu['link']['prefix'])) {
                        $controllerAction .= $subMenu['link']['prefix'] . "/";
                    }

                    if (isset($subMenu['link']['plugin']) && !empty($subMenu['link']['plugin'])) {
                        $controllerAction .= $subMenu['link']['plugin'] . "/";
                    }

                    $controllerAction .= $subMenu['link']['controller'] . "/" . $subMenu['link']['action'];

                    if (!isset($permissions[$controllerAction]) || $permissions[$controllerAction] !== true) {
                        unset($menu[$sortOrder]['links'][$key]);
                    }
                }
            }

            if (empty($menu[$sortOrder]['links'])) {
                unset($menu[$sortOrder]);
            }
        }

        return $menu;
    }

    public function removeSidebarMenu($sidebar, $permissions)
    {
        foreach($sidebar as $data) {
            foreach($data->children as $key => $menu) {
                if(!empty($menu->children)) {
                    $subMenu = $menu->children;
                    foreach($menu->children as $childKey => $childMenu) {
                        if(!empty($childMenu->children)) {
                            $subSubMenu = $childMenu->children;
                            foreach($childMenu->children as $childChildKey => $childChildMenu) {
                                $result = $this->checkPermission($childChildMenu, $permissions);
                                if($result === false) {
                                    unset($data->children[$key]->children[$childKey]->children[$childChildKey]);
                                }
                            }

                            if(count($subSubMenu) > 0 && count($data->children[$key]->children[$childKey]->children) == 0) {
                                unset($data->children[$key]->children[$childKey]);
                            }
                        } else {
                            $result = $this->checkPermission($childMenu, $permissions);
                            if($result === false) {
                                unset($data->children[$key]->children[$childKey]);
                            }
                        }
                    }

                    if(count($subMenu) > 0 && count($data->children[$key]->children) == 0) {
                        unset($data->children[$key]);
                    }
                } else {
                    $result = $this->checkPermission($menu, $permissions);
                    if($result === false) {
                        unset($data->children[$key]);
                    }
                }
            }
        }

        return $sidebar;
    }

    /**
     * Check permission
     *
     * @param $menu
     * @param $permissions
     * @return bool
     */
    private function checkPermission($menu, $permissions)
    {
        $controllerAction = $this->buildMenuUrl($menu);
        if (!isset($permissions[$controllerAction]) || $permissions[$controllerAction] !== true) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Build menu URL
     *
     * @param $menu
     * @return string
     */
    public function buildMenuUrl($menu)
    {
        $controllerAction = "";
        if (isset($menu->plugin) && !empty($menu->plugin)) {
            if($menu->plugin != 'ItoolCore') {
                $controllerAction .= $menu->plugin . "/";
            }
        }

        if (isset($menu->controller) && !empty($menu->controller)) {
            $controllerAction .= $menu->controller . "/";
        }

        if (isset($menu->action) && !empty($menu->action)) {
            $controllerAction .= $menu->action;
        }

        return $controllerAction;
    }
}
