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
        $payload = json_decode($this->getHttpRequest()->getRawBody(), true);

        $this->facade->setApiData('substitutes', $payload);
        $this->sendJson(['status' => 'success']);
    }

    public function actionSetAddon()
    {
        $payload = json_decode($this->getHttpRequest()->getRawBody(), true);

        $this->facade->setApiData('addons', $payload);
        $this->sendJson(['status' => 'success']);
    }

    public function actionSetTeacher()
    {
        $payload = json_decode($this->getHttpRequest()->getRawBody(), true);

        $this->facade->setApiData('teachers', $payload);
        $this->sendJson(['status' => 'success']);
    }

    public function actionSetClass()
    {
        $payload = json_decode($this->getHttpRequest()->getRawBody(), true);

        $this->facade->setApiData('classes', $payload);
        $this->sendJson(['status' => 'success']);
    }
}