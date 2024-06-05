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
		// nette
		$router->addRoute('/supl/www/sign/in', 'Sign:in');
		$router->addRoute('/supl/www/sign/out', 'Sign:out');
		// get api
		$router->addRoute('/supl/www/api/getLoginStatus', 'Api:GetLoginStatus');
		$router->addRoute('/supl/www/api/getSubstitutes', 'Api:GetSubstitutes');
		$router->addRoute('/supl/www/api/getTeachers', 'Api:GetTeachers');
		$router->addRoute('/supl/www/api/getClasses', 'Api:GetClasses');
		$router->addRoute('/supl/www/api/getAddons', 'Api:GetAddons');
		// set api
		$router->addRoute('/supl/www/api/setSubstitute', 'Api:SetSubstitute');
		$router->addRoute('/supl/www/api/setAddon', 'Api:SetAddon');
		$router->addRoute('/supl/www/api/setTeacher', 'Api:SetTeacher');
		$router->addRoute('/supl/www/api/setClass', 'Api:SetClass');
		// react
		$router->addRoute('/supl/www/[<param .+>]', 'Home:default');
		return $router;
	}
}
