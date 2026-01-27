package com.fawry.blog.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Around("execution(* com.fawry.blog.controller..*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        logger.info("===> REQUEST: {}.{}() with arguments: {}", className, methodName, Arrays.toString(args));

        long start = System.currentTimeMillis();

        Object result;
        try {

            result = joinPoint.proceed();
        } catch (Throwable throwable) {
            logger.error("XXX> EXCEPTION in {}.{}(): {}", className, methodName, throwable.getMessage());
            throw throwable;
        }

        long executionTime = System.currentTimeMillis() - start;

        logger.info("<=== RESPONSE: {}.{}() executed in {}ms. Result: {}", className, methodName, executionTime, result);

        return result;
    }
}