import betaLogo from "../assets/beta-logo.png";

type Props = {
  size?: number;
};

export default function BetaLogo({ size = 36 }: Props) {
  return (
    <img 
      src={betaLogo} 
      alt="Logo BETA" 
      width={size} 
      height={size} 
      style={{ objectFit: 'contain' }}
    />
  );
}