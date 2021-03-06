import React from 'react';
import { arrayOf, node, number, shape, string } from 'prop-types';

import ComponentTiming from '../ComponentTiming/ComponentTiming';
import './CaptureCycleSection.css';

const CaptureCycleSection = (props) => (
  props != null && props.components != null && props.components.length > 0 && <section>
    {props.heading != null && props.heading}
    <ul className='capture-cycle--components'>
      {props.components.map((component, timingIndex) =>
        <ComponentTiming
          key={`capture-cycle-${props.captureCycleIndex}-component-${timingIndex}`}
          name={component.componentName}
          loadTime={component.componentLoadTime}
        />
      )}
    </ul>
  </section>
);

CaptureCycleSection.propTypes = {
  captureCycleIndex: number,
  components: arrayOf(shape({
    componentLoadTime: number,
    componentName: string
  })),
  heading: node
};

export default CaptureCycleSection;
