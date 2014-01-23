<?php

App::uses('AppController', 'Controller');

class CFormsController extends AppController {

    public $helpers = array('Html', 'Form');

    public function index()
    {
    }

    public function api($id = 0)
    {
        $this->autoRender = false;

        if($this->request->is('post'))
        {
            $out = $this->saveForm();
        }
        elseif($this->request->is('delete'))
        {
            $out = $this->deleteForm($id);
        }
        else
        {
            $out = $id ? $this->getForm($id) : $this->getAllForms();
        }

        header('Content-Type: application/json; charset=utf8');
        echo json_encode($out);
    }

    private function getForm($id)
    {
        return $this->getFormArray($this->CForm->findById($id));
    }

    private function getAllForms()
    {
        $out = array();

        $forms = $this->CForm->find('all');
        foreach($forms as $form)
        {
            $out[] = $this->getFormArray($form);
        }

        return $out;
    }

    private function getFormArray($data)
    {
        $data = $data['CForm'];
        $data['persons'] = json_decode($data['persons']);
        $data['courses'] = json_decode($data['courses']);
        $data['resources'] = json_decode($data['resources']);
        return $data;
    }

    private function saveForm()
    {
        if($this->CForm->save($this->request->data))
        {
            return array(
                'id' => $this->CForm->id,
            );
        }

        return array(
            'error' => $this->CForm->validationErrors,
        );
    }

    private function deleteForm($id)
    {
        $result = array();

        if($this->CForm->delete($id))
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
