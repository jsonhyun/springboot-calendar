package com.neoulsoft.calendar.controller;

import com.neoulsoft.calendar.dto.TodoDto;
import com.neoulsoft.calendar.persistence.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todo/*")
public class TodoRestController {

    @Autowired
    private TodoService todoService;

    @RequestMapping(value = "/{tMonth}/{tDate}", method = RequestMethod.GET)
    public ResponseEntity<List<TodoDto>> todoList(@PathVariable("tMonth") int tMonth, @PathVariable("tDate") int tDate) {
        ResponseEntity<List<TodoDto>> entity = null;

        try{
            TodoDto todo = new TodoDto();
            todo.settMonth(tMonth);
            todo.settDate(tDate);
            List<TodoDto> list = todoService.selectList(todo);
            entity = new ResponseEntity<>(list, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/todoRegister", method = RequestMethod.POST)
    public ResponseEntity<String> todoListResister(@RequestBody TodoDto todo) {
        ResponseEntity<String> entity = null;

        try{
            todoService.insertList(todo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/todoModify", method = RequestMethod.PUT)
    public ResponseEntity<String> todoListModify(@RequestBody TodoDto todo) {
        ResponseEntity<String> entity = null;

        try{
            todoService.updateList(todo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/todoCheck", method = RequestMethod.PUT)
    public ResponseEntity<String> todoCheckModify(@RequestBody TodoDto todo) {
        ResponseEntity<String> entity = null;

        try{
            todoService.updateCheck(todo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/todoNoCheck", method = RequestMethod.PUT)
    public ResponseEntity<String> todoNoCheckModify(@RequestBody TodoDto todo) {
        ResponseEntity<String> entity = null;

        try{
            todoService.updateNoCheck(todo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/todoRemove", method = RequestMethod.DELETE)
    public ResponseEntity<String> todoListRemove(@RequestBody TodoDto todo) {
        ResponseEntity<String> entity = null;

        try{
            todoService.deleteList(todo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }
}
