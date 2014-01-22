<?php

App::uses('AppController', 'Controller');

class CFormsController extends AppController {

    public $helpers = array('Html', 'Form');

    public function index()
    {
        $formsSimple = array();
        $forms = $this->CForm->find('all');
        foreach($forms as $form)
        {
            $data = json_decode($form['CForm']['data']);
            $formsSimple[$form['CForm']['id']] = $data->firstName . ' ' . $data->lastName;
        }

        $this->set('forms', $formsSimple);
    }

    public function view($id = null)
    {
        if(!$id)
        {
            throw new NotFoundException(__('Invalid form'));
        }

        $form = $this->CForm->findById($id);
        if(!$form)
        {
            throw new NotFoundException(__('Invalid form'));
        }

        $this->set('form', $form);
    }

    public function edit($id = null)
    {
        if($this->request->is('post') && $this->CForm->save($this->request->data))
        {
            $this->Session->setFlash('Form has been saved.');
            return $this->redirect('/');
        }

        $this->set('form', $this->CForm->findById($id));
    }

    public function api($id = 0)
    {
        $this->autoRender = false;

        if($this->request->is('post'))
        {
            echo $this->saveForm();
            return;
        }
        elseif($this->request->is('delete'))
        {
            echo $this->deleteForm($id);
            return;
        }

        $out = $id ? $this->getForm($id) : $this->getAllForms();

        header('Content-Type: application/json; charset=utf8');
        echo json_encode($out);
    }

    private function getForm($id)
    {
        $out = $this->CForm->findById($id);
        $out = $out['CForm'];
        $out['data'] = json_decode($out['data']);
        return $out;
    }

    private function getAllForms()
    {
        $out = array();

        $forms = $this->CForm->find('all');
        foreach($forms as $form)
        {
            $data = json_decode($form['CForm']['data']);
            $out[] = array(
                'id' => $form['CForm']['id'],
                'name' => $data->firstName . ' ' . $data->lastName,
                'data' => $data,
            );
        }

        return $out;
    }

    private function saveForm()
    {
        // hack ;-P
        $this->request->data['data'] = $this->request->data[0];

        if($this->CForm->save($this->request->data))
        {
            return json_encode(array(
                'id' => $this->CForm->id,
            ));
        }

        return json_encode(array(
            'error' => $this->CForm->validationErrors,
        ));
    }

    private function deleteForm($id)
    {
        if($this->CForm->delete($id))
        {
            $out = array(
                'deleted' => 1,
            );
        }
        else
        {
            $out = array(
                'error' => 1,
            );
        }

        return json_encode($out);
    }

//     public function delete($id) {
//         if ($this->CForm->delete($id)) {
//             $message = 'Deleted';
//         } else {
//             $message = 'Error';
//         }
//         $this->set(array(
//             'message' => $message,
//             '_serialize' => array('message')
//         ));
//     }
}
