/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabrielecavallo
 * File: metadata.test.ts
 * Project: pamela
 * Committed last: 2022/11/25 @ 1633
 * ---
 * Description:
 */

import Pamela from "../lib";

it('Should correctly edit the metadata of this richtext', () => {
    const r = new Pamela.RichText({
        fill: 'black',
        name: 'myRichText',
        width: 200,
        height: 200
    });

    r.setMetadataObj({myObject: 'ciao'});
    const k = r.getMetadataKey('myObject');
    r.setMetadataKey('key2', 23);

    expect(k).toEqual('ciao');
    expect(r.getMetadataKey<number>("key2"));
})

it('Should correctly set the metadata', () => {
    const r = new Pamela.RichText({
        fill: 'black',
        name: 'myRichText',
        width: 200,
        height: 200
    });

    r.setMetadataKey('key1', 24);
    r.setMetadataKey('key2', false);

    expect(r.getMetadataKey<number>('key1')).toEqual(24);
    expect(r.getMetadataKey<boolean>('key2')).toEqual(false);
    r.deleteMetadataKey('key1');

    expect(r.getMetadataKey('key1')).not.toBeDefined();

    r.setMetadataKey('myKey23', 24);
    expect(r.getMetadataKey('myKey23')).toEqual(24);
    r.metadata(undefined);

    expect(r.getMetadataKey('myKey23')).not.toBeDefined();
})