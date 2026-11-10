package com.sujesh.prep.service;

import com.sujesh.prep.model.InterviewQuestion;

import java.time.LocalDateTime;

public interface InterviewQuestionGenerator {

    InterviewQuestion generate(LocalDateTime triggerTime);
}
