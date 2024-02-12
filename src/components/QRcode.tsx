'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { FC } from 'react';

interface QRCodeProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  onClick?: () => void;
}

const QRCode: FC<QRCodeProps> = (props) => {
  return (
    <QRCodeCanvas
      value={props.url}
      bgColor={'#ffffff'}
      fgColor={'#000000'}
      level={'L'}
      includeMargin={false}
      className={props.className}
      style={props.style}
      id={props.id}
      onClick={props.onClick}
    />
  );
};

export default QRCode;
