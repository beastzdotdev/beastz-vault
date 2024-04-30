import { SVGProps, lazy } from 'react';
import { Gender } from '../../../shared/enum';

const M = lazy(() => import('../../../assets/images/profile/doodle-man-1.svg?react'));
const F = lazy(() => import('../../../assets/images/profile/doodle-woman-1.svg?react'));
const O = lazy(() => import('../../../assets/images/profile/other.svg?react'));

type DefaultLogoProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & { gender: Gender };

export const DefaultLogo = (params: DefaultLogoProps) => {
  const { gender: _, ...rest } = params;

  switch (params.gender) {
    case Gender.MALE:
      return <M {...rest} />;
    case Gender.FEMALE:
      return <F {...rest} />;
    case Gender.OTHER:
    default:
      return <O {...rest} />;
  }
};
