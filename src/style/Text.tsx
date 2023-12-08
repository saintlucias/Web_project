import styled, { css } from 'styled-components';

interface TextProps {
  done: boolean;
}

export const Text = styled.div<TextProps>`
  flex: 1;
  font-size: 21px;
  color: #495057;

  ${({ done }) =>
    done &&
    css`
      color: skyblue;
    `}
`;