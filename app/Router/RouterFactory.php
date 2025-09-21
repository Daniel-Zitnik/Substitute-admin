<?php

declare(strict_types=1);

namespace App\Router;

use Nette;
use Nette\Application\Routers\RouteList;


final class RouterFactory
{
	use Nette\StaticClass;

	public static function createRouter(): RouteList
	{
		$router = new RouteList;
		$base_url = '/supl/www/';
		// nette
		$router->addRoute($base_url . 'sign/in', 'Sign:in');
		$router->addRoute($base_url . 'sign/out', 'Sign:out');
		// get api
		$router->addRoute($base_url . 'api/getLoginStatus', 'Api:GetLoginStatus');
		$router->addRoute($base_url . 'api/getSubstitutes', 'Api:GetSubstitutes');
		$router->addRoute($base_url . 'api/getTeachers', 'Api:GetTeachers');
		$router->addRoute($base_url . 'api/getClasses', 'Api:GetClasses');
		$router->addRoute($base_url . 'api/getAddons', 'Api:GetAddons');
		// set api
		$router->addRoute($base_url . 'api/setSubstitute', 'Api:SetSubstitute');
		$router->addRoute($base_url . 'api/setAddon', 'Api:SetAddon');
		$router->addRoute($base_url . 'api/setTeacher', 'Api:SetTeacher');
		$router->addRoute($base_url . 'api/setClass', 'Api:SetClass');
		// react
		$router->addRoute($base_url . '[<param .+>]', 'Home:default');
		return $router;
	}
}
