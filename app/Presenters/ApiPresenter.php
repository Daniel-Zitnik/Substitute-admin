<?php

namespace App\Presenters;

use Nette\Application\UI\Presenter;
use App\Model\ApiFacade;

class ApiPresenter extends Presenter
{
    public function __construct(
		private ApiFacade $facade,
	) {

	}

    public function actionGetLoginStatus()
    {
        $isLoggedIn = $this->user->isLoggedIn();
        $this->sendJson(['isLoggedIn' => $isLoggedIn]);
    }

    public function actionGetSubstitutes()
    {
        $payload = json_decode($this->getHttpRequest()->getRawBody(), true);
        $date = $payload['value'];

        $data = $this->facade
            ->getApiData('substitutes', $date);

        $this->sendJson($data);
    }

    public function actionGetTeachers()
    {
        $data = $this->facade
            ->getApiData('teachers');

        $this->sendJson($data);
    }

    public function actionGetClasses()
    {
        $data = $this->facade
            ->getApiData('classes');

        $this->sendJson($data);
    }

    public function actionGetAddons()
    {
        $payload = json_decode($this->getHttpRequest()->getRawBody(), true);
        $date = $payload['value'];
        
        $data = $this->facade
            ->getApiData('addons', $date);

        $this->sendJson($data);
    }

    public function actionSetSubstitute()
    {
        $this->setData('substitutes');
    }

    public function actionSetAddon()
    {
        $this->setData('addons');
    }

    public function actionSetTeacher()
    {
        $this->setData('teachers');
    }

    public function actionSetClass()
    {
        $this->setData('classes');
    }

    private function setData($table) {
        if ($this->user->isLoggedIn()) {
            $payload = json_decode($this->getHttpRequest()->getRawBody(), true);

            $this->facade->setApiData($table, $payload);
            $this->sendJson(['status' => 'success']);
        } else {
            $this->sendJson(['status' => 'user not logged in']);
        }
    }
}