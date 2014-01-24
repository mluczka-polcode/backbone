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
        $this->loadModel('Occupation');

        $this->autoRender = false;

        if($this->request->is('post'))
        {
            $out = $this->saveOccupation();
        }
        elseif($this->request->is('delete'))
        {
            $out = $this->deleteOccupation($id);
        }
        else
        {
            $out = $id ? $this->getOccupation($id) : $this->getAllOccupations();
        }

        header('Content-Type: application/json; charset=utf8');
        echo json_encode($out);
    }

    private function getOccupation($id)
    {
        return $this->decodeOccupation($this->Occupation->findById($id));
    }

    private function getAllOccupations()
    {
        $out = array();

        $occupations = $this->Occupation->find('all');
        foreach($occupations as $item)
        {
            $out[] = $this->decodeOccupation($item);
        }

        return $out;
    }

    private function decodeOccupation($data)
    {
        return $data['Occupation'];
    }

    private function saveOccupation()
    {
        if($this->Occupation->save($this->request->data))
        {
            return array(
                'id' => $this->Occupation->id,
            );
        }

        return array(
            'error' => $this->Occupation->validationErrors,
        );
    }

    private function deleteOccupation($id)
    {
        $result = array();
return $result;

        if($this->Occupation->delete($id))
        {
            $result['deleted'] = 1;
        }
        else
        {
            $result['error'] = 1;
        }

        return $result;
    }

    public function resource($id = 0)
    {
        $this->loadModel('Resource');

        $this->autoRender = false;

        if($this->request->is('post'))
        {
            $out = $this->saveResource();
        }
        elseif($this->request->is('delete'))
        {
            $out = $this->deleteResource($id);
        }
        else
        {
            $out = $id ? $this->getResource($id) : $this->getAllResources();
        }

        header('Content-Type: application/json; charset=utf8');
        echo json_encode($out);
    }

    private function getResource($id)
    {
        return $this->decodeResource($this->Resource->findById($id));
    }

    private function getAllResources()
    {
        $out = array();

        $resources = $this->Resource->find('all');
        foreach($resources as $item)
        {
            $out[] = $this->decodeResource($item);
        }

        return $out;
    }

    private function decodeResource($data)
    {
        return $data['Resource'];
    }

    private function saveResource()
    {
        if($this->Resource->save($this->request->data))
        {
            return array(
                'id' => $this->Resource->id,
            );
        }

        return array(
            'error' => $this->Resource->validationErrors,
        );
    }

    private function deleteResource($id)
    {
        $result = array();
return $result;

        if($this->Resource->delete($id))
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
