<?php

App::uses('AppController', 'Controller');

class CFormsController extends AppController
{
    public $helpers = array('Html', 'Form');

    public function index()
    {
        $this->set('formsConfig', json_encode(array(
            'occupations' => $this->getOccupationsList(),
            'resources'   => $this->getResourcesList(),
        )));
    }

    private function getOccupationsList()
    {
        $this->loadModel('Occupation');
        $out = $this->Occupation->find('list', array(
            'fields' => array('name')
        ));

        return array_values($out);
    }

    private function getResourcesList()
    {
        $this->loadModel('Resource');
        $out = $this->Resource->find('list', array(
            'fields' => array('name')
        ));
        return array_values($out);
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
        return $this->decodeForm($this->CForm->findById($id));
    }

    private function getAllForms()
    {
        $out = array();

        $forms = $this->CForm->find('all');
        foreach($forms as $form)
        {
            $out[] = $this->decodeForm($form);
        }

        return $out;
    }

    private function decodeForm($data)
    {
        $data = $data['CForm'];
        $data['occupations'] = json_decode($data['occupations']);
        $data['persons']     = json_decode($data['persons']);
        $data['courses']     = json_decode($data['courses']);
        $data['resources']   = json_decode($data['resources']);
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
