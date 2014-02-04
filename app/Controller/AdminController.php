<?php
App::uses('Controller', 'Controller');

class AdminController extends AppController
{
    public $helpers = array('Html', 'Form');

    public function index()
    {
    }

    public function occupation($id = 0)
    {
        $this->restApi('Occupation', $id);
    }

    public function resource($id = 0)
    {
        $this->restApi('Resource', $id);
    }

    public function course($id = 0)
    {
        $this->restApi('Course', $id);
    }

    private function restApi($model, $id)
    {
        $this->loadModel($model);

        $this->autoRender = false;

        if($this->request->is('post') || $this->request->is('put'))
        {
            $data = (array) json_decode($this->request->data['model']);
            $out = $this->save($model, $data);
        }
        elseif($this->request->is('delete'))
        {
            $out = $this->delete($model, $id);
        }
        else
        {
            $out = $id ? $this->get($model, $id) : $this->getAll($model);
        }

        header('Content-Type: application/json; charset=utf8');
        echo json_encode($out);
    }

    private function get($model, $id)
    {
        $data = $this->$model->findById($id);
        return $data[$model];
    }

    private function getAll($model)
    {
        $out = array();

        $data = $this->$model->find('all');
        foreach($data as $item)
        {
            $out[] = $item[$model];
        }

        return $out;
    }

    private function save($model, $data)
    {
        if($this->$model->save($data))
        {
            return array(
                'id' => $this->$model->id,
            );
        }

        return array(
            'error' => $this->$model->validationErrors,
        );
    }

    private function delete($model, $id)
    {
        $result = array();

        if($this->$model->delete($id))
        {
            $result['deleted'] = 1;
        }
        else
        {
            $result['error'] = 1;
        }

        return $result;
    }

}
