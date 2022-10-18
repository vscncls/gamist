import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

type Inputs = {
  username: string;
  email: string;
  password: string;
};

const singupRequest = async (inputs: Inputs): Promise<void> => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
  console.log(apiUrl);
  try {
    await axios.post(`${apiUrl}/singup`, { ...inputs, id: uuidv4() });
  } catch (error) {
    console.log(error.message);
  }
};

export const Singup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<Inputs>();

  if (isSubmitted) {
    return <Redirect to="/signin" />;
  }

  return (
    <VStack spacing={8}>
      <form onSubmit={handleSubmit(singupRequest)}>
        <FormControl isInvalid={errors.username}>
          <FormLabel mt={3} htmlFor="username">
            Nome de usuario
          </FormLabel>
          <Input
            id="username"
            placeholder="username_123"
            {...register("username", {
              required: "Esse campo e obrigatorio",
              minLength: {
                value: 3,
                message: "Seu nome de usuario deve ter no minimo 3 caracteres",
              },
            })}
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            placeholder="brunera@example.com"
            {...register("email", {
              required: "Esse campo e obrigatorio",
              pattern: {
                message: "Email invalido",
                value: /.*@.*/,
              },
            })}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={errors.password}>
          <FormLabel htmlFor="password">Senha</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="**********"
            {...register("password", {
              required: "Esse campo e obrigatorio",
              minLength: {
                value: 5,
                message: "Senha deve ter no minimo 5 caracteres",
              },
            })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        <Button
          float="right"
          mt={3}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Cadastrar
        </Button>
      </form>
    </VStack>
  );
};
