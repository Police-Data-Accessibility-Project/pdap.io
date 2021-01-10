import React from "react"
import renderer from "react-test-renderer"
import { StaticQuery } from "gatsby"
import Layout from "../Layout"

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      site: {
        siteMetadata: {
          title: `Default Starter`,
        },
      },
    })
  )
})

describe.skip("Layout", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Layout />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
