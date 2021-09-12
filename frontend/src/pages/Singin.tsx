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
import UniversalCookie from "universal-cookie";

type Inputs = {
  email: string;
  password: string;
};

type Response = {
  sessionToken: string;
};

const singupRequest = async (inputs: Inputs): Promise<void> => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
  const response = await axios.post<Response>(`${apiUrl}/singin`, inputs);
  const cookie = new UniversalCookie();
  cookie.set("sessionToken", response.data.sessionToken);
};

export const Singin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<Inputs>();

  if (isSubmitted) {
    return <Redirect to="/games" />;
  }

  return (
    <VStack spacing={8}>
      <form onSubmit={handleSubmit(singupRequest)}>
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
          Logar
        </Button>
      </form>
    </VStack>
  );
};
