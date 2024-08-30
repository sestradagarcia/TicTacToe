import { useNavigate } from "@solidjs/router";
import { View } from "@lightningjs/solid";
import { useFocusManager, useAnnouncer } from "@lightningjs/solid-primitives";

const App = (props) => {
  useFocusManager({
    Menu: 'm',
  });
  
  const navigate = useNavigate();
  const announcer = useAnnouncer();
  announcer.debug = false;
  announcer.enabled = false;

  return (
    <View ref={window.APP}
      onAnnouncer={() => announcer.enabled = !announcer.enabled}
      onLast={() => history.back()}
      onMenu={() => navigate('/menu')}>
        <View color={0x071423ff} />
        {props.children}
    </View>
  )
};

export default App;
