import React from "react";

import { RenderOptions, Instance, Text, Box, render } from "ink";
import deepmerge from "deepmerge";
import InkSpinner from "ink-spinner";
import { ThothLog } from "../index.tsx";

type SpinnerComponentProps = {
  prefixText?: string;
  text: string;
  uid: string;
};

export const SpinnerComponent = ({
  prefixText,
  text,
  uid,
}: SpinnerComponentProps) => {
  return (
    <Box key={`root-${uid}`}>
      {prefixText && <Text key={`prefix-${uid}`}>{prefixText}</Text>}
      <InkSpinner key={`spinner-${uid}`} />
      <Text key={`text-${uid}`}>{text}</Text>
    </Box>
  );
};

type CreateSpinnerParams = {
  prefixText?: string;
  text: string;
};

type RenderProps = {
  prefixText?: string;
  text: string;
};

type SpinnerParams = CreateSpinnerParams;
export class Spinner {
  private _prefixText?: string;
  private _text!: string;

  // private instance: Instance;
  public component: React.ReactNode | null = null;
  private owner: ThothLog;

  constructor(owner: ThothLog, { prefixText, text }: SpinnerParams) {
    this.owner = owner;
    this.props = {
      prefixText,
      text,
    };
  }

  set text(value: string) {
    this._text = value;
    this.rerender();
  }

  get text(): string {
    return this._text;
  }

  set prefixText(value: string) {
    this._prefixText = value;
    this.rerender();
  }

  get props() {
    return {
      prefixText: this.prefixText,
      text: this.text,
    };
  }
  set props(inputProps: RenderProps) {
    this._prefixText = inputProps.prefixText;
    this._text = inputProps.text;
  }

  public rerender(inputProps: Partial<RenderProps> = {}) {
    const props = {
      ...deepmerge(this.props, inputProps),
      uid: this.owner.uid,
    };
    this.owner.component = <SpinnerComponent key={this.owner.uid} {...props} />;
    this.owner.DOM.refresh();
  }

  get prefixText(): string | undefined {
    return this._prefixText;
  }

  // destroy(): void {
  //   this.instance.unmount();
  // }
}

export function createSpinner(
  owner: ThothLog,
  { text, prefixText }: CreateSpinnerParams
): Spinner {
  const spinner = new Spinner(owner, {
    prefixText,
    text,
  });

  return spinner;
}
