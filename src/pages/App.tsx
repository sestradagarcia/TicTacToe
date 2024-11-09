import { useNavigate } from "@solidjs/router";
import { View } from "@lightningtv/solid";
import { useFocusManager, useAnnouncer } from "@lightningtv/solid/primitives";
import { KeyMap } from "@lightningtv/core/focusManager";

const App = (props) => {
  useFocusManager({
    Menu: 'm',
  } as Partial<KeyMap>);

  const navigate = useNavigate();
  const announcer = useAnnouncer();
  announcer.debug = false;
  announcer.enabled = false;

  return (
    <View
      onAnnouncer={() => announcer.enabled = !announcer.enabled}
      onLast={() => history.back()}
      onMenu={() => navigate('/menu')}>
      <View color={0x071423ff} />
      {props.children}
    </View>
  )
};

export default App;
