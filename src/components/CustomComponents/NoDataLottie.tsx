import Lottie from 'lottie-react'
import NoDataLottie from '../../assets/lottie/NoDataLottie.json';

export default function NoDataLottieComponent() {
  return (
     <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Lottie
        animationData={NoDataLottie}
        loop={true}
        style={{ height: 300 }}
      />
    </div>
  )
}
