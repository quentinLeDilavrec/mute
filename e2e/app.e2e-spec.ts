import { browser, promise, protractor, ProtractorBrowser } from 'protractor'

import { focusEditor, getEditorValue } from './doc.po'

describe('mute App', () => {

  beforeEach(() => {})

  it('angular should stabilize on docs page', async () => {
    await browser.get('/')
    await browser.waitForAngular()
  })

  // TODO: Fix this test
  it('angular should stabilize on doc page', async () => {
    await browser.get('/test-e2e-stabilize')
    await browser.waitForAngular()
  })

  it('should have a title', async () => {
    await browser.get('/')
    const actualTitle = await browser.getTitle()
    expect(actualTitle).toEqual('Mute')
  })

  it('should store updates of the document', async () => {
    const expectedText = 'Hello world !'
    await browser.get('/test-e2e-recover')
    await focusEditor(browser)
    await browser.actions().sendKeys(expectedText).perform()
    await browser.waitForAngular()
    await browser.refresh()
    await browser.waitForAngular()
    const actualText = await getEditorValue(browser)
    expect(actualText).toEqual(expectedText)
  })

  it('should broadcast updates to peers', async () => {
    const expectedText1 = 'Hellow'
    const expectedText2 = 'Hello world !'
    await browser.get('/test-e2e-broadcast')
    const peerBrowser: ProtractorBrowser =  await browser.forkNewDriverInstance(true).ready
    await browser.waitForAngular()

    await focusEditor(browser)
    await focusEditor(peerBrowser)

    await browser.actions().sendKeys(expectedText1).perform()
    await browser.waitForAngular()
    const actualText1 = await getEditorValue(peerBrowser)
    expect(actualText1).toEqual(expectedText1)

    const sequence = `${protractor.Key.BACK_SPACE} world !`
    await peerBrowser.actions().sendKeys(sequence).perform()
    await browser.waitForAngular()
    const actualText2 = await getEditorValue(browser)
    expect(actualText2).toEqual(expectedText2)

    await peerBrowser.quit()
  })

  it('should retrieve updates from peers when connecting', async () => {
    const expectedText = 'Hello world !'
    const peerBrowser: ProtractorBrowser =  await browser.forkNewDriverInstance().ready

    await browser.get('/test-e2e-retrieve-doc-on-connection')
    await focusEditor(browser)
    await browser.actions().sendKeys(expectedText).perform()

    await peerBrowser.get('/test-e2e-retrieve-doc-on-connection')
    await peerBrowser.waitForAngular() // Join the network
    await browser.waitForAngular() // Send the updates
    await peerBrowser.waitForAngular() // Handle the updates
    const actualText = await getEditorValue(peerBrowser)
    expect(actualText).toEqual(expectedText)

    await peerBrowser.quit()
  })

  it('should send updates to peers when connecting', async () => {
    const expectedText = 'Hello world !'
    const peerBrowser: ProtractorBrowser =  await browser.forkNewDriverInstance().ready

    // Edit a document
    await browser.get('/test-e2e-share-updates-on-connection')
    await focusEditor(browser)
    await browser.actions().sendKeys(expectedText).perform()
    await browser.waitForAngular()

    // Leave the collaboration before other peer joins
    await browser.get('/')
    await peerBrowser.get('/test-e2e-share-updates-on-connection')
    const actualText1 = await getEditorValue(peerBrowser)
    expect(actualText1).toEqual('')

    // Re-join the collaboration and share previous updates
    await browser.get('/test-e2e-share-updates-on-connection')
    await peerBrowser.waitForAngular()
    await browser.waitForAngular()
    const actualText2 = await getEditorValue(peerBrowser)
    expect(actualText2).toEqual(expectedText)

    await peerBrowser.quit()
  })
})
