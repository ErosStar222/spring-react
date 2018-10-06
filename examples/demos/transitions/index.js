import React from 'react'
import { Transition, animated } from 'react-spring'

const defaultStyles = {
  overflow: 'hidden',
  width: '100%',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2em',
  fontFamily: "'Kanit', sans-serif",
  textTransform: 'uppercase',
}

export default class TransitionsExample extends React.PureComponent {
  state = { items: ['1', '2', '3'] }

  async componentDidMount() {
    this.t1 && clearTimeout(this.t1)
    this.t2 && clearTimeout(this.t2)
    this.t3 && clearTimeout(this.t3)
    this.t4 && clearTimeout(this.t4)
    this.t5 && clearTimeout(this.t5)

    this.setState({ items: [] })

    // new items: 1, 2, 3
    this.t1 = await this.animate('1', '2', '3')
    // new item in between: 4
    this.t2 = await this.animate('1', '2', '4', '3')
    // deleted item: 2
    this.t3 = await this.animate('1', /*'2',*/ '3', '4')
    // scrambled order + re-entering item: 2
    this.t4 = await this.animate('4', /*'2',*/ '1', '2', '3')
    this.t5 = await this.animate('4', /*'2',*/ '1', /*'2',*/ '3')
  }

  animate = (...items) =>
    new Promise(res => {
      const handle = setTimeout(
        () => this.setState({ items }, () => res(handle)),
        1000
      )
    })

  render() {
    return (
      <ul
        style={{
          backgroundColor: '#70C1B3',
          overflow: 'hidden',
          cursor: 'pointer',
          margin: 0,
          padding: 0,
        }}
        onClick={() => this.componentDidMount()}>
        <Transition
          keys={this.state.items}
          //initial={null}
          from={{ height: 0, opacity: 0 }}
          enter={{ height: 50, opacity: 1 }}
          leave={{ height: 0, opacity: 0 }}
          delay={600}>
          {this.state.items.map(item => styles => (
            <animated.li style={{ ...defaultStyles, ...styles }}>
              {item}
            </animated.li>
          ))}
        </Transition>
      </ul>
    )
  }
}
