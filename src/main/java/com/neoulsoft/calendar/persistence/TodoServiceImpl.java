package com.neoulsoft.calendar.persistence;

import com.neoulsoft.calendar.dto.TodoDto;
import com.neoulsoft.calendar.mapper.TodoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoServiceImpl implements TodoService{

    @Autowired
    private TodoMapper mapper;

    @Override
    public List selectList(TodoDto todo) throws Exception {
        return mapper.selectList(todo);
    }

    @Override
    public void insertList(TodoDto todo) throws Exception {
        mapper.insertList(todo);
    }

    @Override
    public void updateList(TodoDto todo) throws Exception {
        mapper.updateList(todo);
    }

    @Override
    public void deleteList(TodoDto todo) throws Exception {
        mapper.deleteList(todo);
    }

    @Override
    public void updateCheck(TodoDto todo) throws Exception {
        mapper.updateCheck(todo);
    }

    @Override
    public void updateNoCheck(TodoDto todo) throws Exception {
        mapper.updateNoCheck(todo);
    }
}
