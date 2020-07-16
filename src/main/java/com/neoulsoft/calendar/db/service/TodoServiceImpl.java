package com.neoulsoft.calendar.db.service;

import com.neoulsoft.calendar.db.mapper.TodoMapper;
import com.neoulsoft.calendar.vo.TodoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoServiceImpl implements TodoService{

    @Autowired
    private TodoMapper mapper;

    @Override
    public List selectList(TodoVO todo) throws Exception {
        return mapper.selectList(todo);
    }

    @Override
    public void insertList(TodoVO todo) throws Exception {
        mapper.insertList(todo);
    }

    @Override
    public void updateList(TodoVO todo) throws Exception {
        mapper.updateList(todo);
    }

    @Override
    public void deleteList(TodoVO todo) throws Exception {
        mapper.deleteList(todo);
    }

    @Override
    public void updateCheck(TodoVO todo) throws Exception {
        mapper.updateCheck(todo);
    }

    @Override
    public void updateNoCheck(TodoVO todo) throws Exception {
        mapper.updateNoCheck(todo);
    }
}
