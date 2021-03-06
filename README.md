<p align="center">
<img src="https://camo.githubusercontent.com/cb217efab8ea638d8169e4ec15b006f194ae6e02/68747470733a2f2f697066732e696f2f697066732f516d62344b4b615a79524b3168677837465575746977556641335a4d3269777a433651757144356a59454465426a2f77696b6970656469612d6f6e2d697066732e706e67" width="40%" />
</p>

<h1 align="center">Distributed Wikipedia Mirror Project</h1>
<p align="center">
Putting Wikipedia Snapshots on IPFS and working towards making it fully read-write.
<br />
<br />
 Existing Mirrors: https://en.wikipedia-on-ipfs.org, https://tr.wikipedia-on-ipfs.org
</p>

## Purpose

“We believe that information—knowledge—makes the world better. That when we ask questions, get the facts, and are able to understand all perspectives on an issue, it allows us to build the foundation for a more just and tolerant society”
-- Katherine Maher, Executive Director of the Wikimedia Foundation

## Wikipedia on IPFS -- Background

### What does it mean to put Wikipedia on IPFS?

The idea of putting Wikipedia on IPFS has been around for a while. Every few months or so someone revives the threads. You can find such discussions in [this github issue about archiving wikipedia](https://github.com/ipfs/archives/issues/20), [this issue about possible integrations with Wikipedia](https://github.com/ipfs/notes/issues/46), and [this proposal for a new project](https://github.com/ipfs/notes/issues/47#issuecomment-140587530).

We have two consecutive goals regarding Wikipedia on IPFS: Our first goal is to create periodic read-only snapshots of Wikipedia. A second goal will be to create a full-fledged read-write version of Wikipedia. This second goal would connect with the Wikimedia Foundation’s bigger, longer-running conversation about decentralizing Wikipedia, which you can read about at https://strategy.m.wikimedia.org/wiki/Proposal:Distributed_Wikipedia

### (Goal 1) Read-Only Wikipedia on IPFS

The easy way to get Wikipedia content on IPFS is to periodically -- say every week -- take snapshots of all the content and add it to IPFS. That way the majority of Wikipedia users -- who only read wikipedia and don’t edit -- could use all the information on wikipedia with all the benefits of IPFS. Users couldn't edit it, but users could download and archive swaths of articles, or even the whole thing. People could serve it to each other peer-to-peer, reducing the bandwidth load on Wikipedia servers. People could even distribute it to each other in closed, censored, or resource-constrained networks -- with IPFS, peers do not need to be connected to the original source of the content, being connected to anyone who has the content is enough. Effectively, the content can jump from computer to computer in a peer-to-peer way, and avoid having to connect to the content source or even the internet backbone. We've been in discussions with many groups about the potential of this kind of thing, and how it could help billions of people around the world to access information better -- either free of censorship, or circumventing serious bandwidth or latency constraints.

So far, we have achieved part of this goal: we have static snapshots of all of Wikipedia on IPFS. This is already a huge result that will help people access, keep, archive, cite, and distribute lots of content. In particular, we hope that this distribution helps people in Turkey, who find themselves in a tough situation. We are still working out a process to continue updating these snapshots, we hope to have someone at Wikimedia in the loop as they are the authoritative source of the content. **If you could help with this, please get in touch with us at wikipedia-project@ipfs.io.**

### (Goal 2) Fully Read-Write Wikipedia on IPFS

The long term goal is to get the full-fledged read-write Wikipedia to work on top of IPFS. This is much more difficult because for a read-write application like Wikipedia to leverage the distributed nature of IPFS, we need to change how the applications write data. A read-write wikipedia on IPFS would allow it to be completely decentralized, and create an extremely difficult to censor operation. In addition to all the benefits of the static version above, the users of a read-write Wikipedia on IPFS could write content from anywhere and publish it, even without being directly connected to any wikipedia.org servers. There would be automatic version control and version history archiving. We could allow people to view, edit, and publish in completely encrypted contexts, which is important to people in highly repressive regions of the world.

A full read-write version (2) would require a strong collaboration with Wikipedia.org itself, and finishing work on important dynamic content challenges -- we are working on all the technology (2) needs, but it's not ready for prime-time yet. We will update when it is.

## How to add new Wikipedia snapshots to IPFS

If you would like to create an updated Wikipedia snapshot on IPFS, you can follow these steps.

**Note: This is a work in progress.**. We intend to make it easy for anyone to create their own wikipedia snapshots and add them to IPFS, but our first emphasis has been to get the initial snapshots onto the network. This means some of the steps aren't as easy as we want them to be. If you run into trouble, seek help through a github issue, commenting in the #ipfs channel in IRC, or by posting a thread on https://discuss.ipfs.io.

### Step 0: Clone this repository

All commands assume to be run inside a cloned version of this repository

Clone the distributed-wikipedia-mirror git repository

```sh
$ git clone https://github.com/ipfs/distributed-wikipedia-mirror.git
```

then `cd` into that directory

```sh
$ cd distributed-wikipedia-mirror
```

### Step 1: Install dependencies

`Node`, `yarn`, `rust` and `make` are required. On Mac OS X you will need `sha256sum`, available in coreutils.

Install the node and rust dependencies:

```sh
$ yarn
```

The yarn install will install `zim_extract`, the rust based extract zim utility (see https://github.com/dignifiedquire/zim), and the `zim-to-website` node script and its node modules.

### Step 2: Configure your IPFS Node

#### Enable Directory Sharding

Configure your IPFS node to enable directory sharding

```sh
$ ipfs config --json 'Experimental.ShardingEnabled' true
```

#### Optional: Switch to `badgerds`

Consider using a [datastore backed by BadgerDB](https://github.com/ipfs/go-ds-badger) for improved performance.  
Existing repository can be converted to badgerds with [ipfs-ds-convert](https://github.com/ipfs/ipfs-ds-convert):

```sh
$ ipfs config profile apply badgerds
$ ipfs-ds-convert convert
```

### Step 3: Run the mirror script

The mirror script will:

1. Download the latest chosen ZIM file from `https://download.kiwix.org/zim/` into the snapshots folder, if the file has been previously downloaded, the file will only be verified (SHA-256).
2. Unpack the ZIM files contents to a directory under `tmp`, e.g. `.tmp/wikipedia_tr_all_maxi_2019-12/`
3. Run a nodejs conversion script on the unpacked directory to create an IPFS hostable website
4. Add the processed directory to your local IPFS instance

To run the mirror script:

```sh
$ ./mirrorzim.sh  \
  --languagecode=<LANGUAGE_CODE> \
  --wikitype=<WIKI_TYPE> \
  [--hostingdnsdomain=<HOSTING_DNS_DOMAIN>] \
  [--hostingipnshash=<HOSTING_IPNS_HASH>] \
  [--mainpageversion=<MAIN_PAGE_VERSION>]
```

The arguments require are:

- LANGUAGE_CODE - the language of the wikimedia site e.g. tr (Turkish) or en (English)
- WIKI_TYPE - the type of the wikimedia site e.g. wikipedia, wikiquote
- HOSTING_DNS_DOMAIN - optional - the domain the IPFS site will be hosted at e.g. tr.wikipedia-on-ipfs.org
- HOSTING_IPNS_HASH - optional - the IPNS hash the IPFS site will be hosted at e.g. QmVH1VzGBydSfmNG7rmdDjAeBZ71UVeEahVbNpFQtwZK8W
- MAIN_PAGE_VERSION - optional - an override hack used on Turkish Wikipedia, it sets the main page version as there are issues with the Kiwix version id

The script will output the CID of the mirror site, which can then be shared.

#### Examples

##### English Wikiquote

```sh
./mirrorzim.sh --languagecode=en --wikitype=wikiquote
```

##### Turkish Wikipedia

```sh
./mirrorzim.sh \
  --languagecode=tr \
  --wikitype=wikipedia \
  --hostingdnsdomain=tr.wikipedia-on-ipfs.org \
  --hostingipnshash=QmVH1VzGBydSfmNG7rmdDjAeBZ71UVeEahVbNpFQtwZK8W \
  --mainpageversion=19869765
```

## Manual Run

To run the parts of the mirror script individually for debugging:

### Step 0: Install dependencies

See above

### Step 1: Download the latest snapshot from kiwix.org

For that you can use the getzim.sh script

First, download the latest wiki lists using `bash ./tools/getzim.sh cache_update`

After that create a download command using `bash ./tools/getzim.sh choose`, it should give an executable command e.g.

```sh
Download command:
    $ ./tools/getzim.sh download wikipedia wikipedia tr all maxi latest
```

Running the command will download the choosen zim file to the `./snapshots` directory.

### Step 2: Unpack the ZIM snapshot

Unpack the ZIM snapshot using `extract_zim`:

```sh
$ ./extract_zim/extract_zim --skip-link ./snapshots/wikipedia_tr_all_maxi_2019-12.zim --out ./tmp/wikipedia_tr_all_maxi_2019-12
Extracting file: ./snapshots/wikipedia_tr_all_maxi_2019-12.zim to ./out

Generating symlinks: false
Generating copies for links: false
Main page is Kullanıcı:The_other_Kiwix_guy/Landing

Extraction done in 25.91s
```

> ### ℹ️ ZIM's main page
>
> The string after `Main page is` as it is the name
> of the landing page set for the ZIM archive.  
> You may also decide to use the original landing page instead (eg. `Main_Page` in `en`, `Anasayfa` in `tr` etc)  
> Kiwix Main page needs to be passed to `zim-to-website`.

### Step 3: Convert the unpacked zim directory to a website with mirror info

IMPORTANT: The snapshots must say who disseminated them. This effort to mirror Wikipedia snapshots is not affiliated with the Wikimedia foundation and is not connected to the volunteers whose contributions are contained in the snapshots. The snapshots must include information explaining that they were created and disseminated by independent parties, not by Wikipedia.

The conversion to a working website and the appending of necessary information is is done by the node program under `./bin/run`.

```sh
$ node ./bin/run --help
```

First though the main page, as the archive appears on the appropriate wikimedia website, must be determined. For instance, the zim file for Turkish Wikipedia has a main page of `Kullanıcı:The_other_Kiwix_guy/Landing` but `https://tr.wikipedia.org` uses `Anasayfa.html` as the main page. Both must be passed to the node script.

To determine the website main page use `./tools/find_main_page_name.sh` passing the website:

```sh
$ ./tools/find_main_page_name.sh tr.wikiquote.org
Anasayfa.html
```

The conversion is done on the unpacked zim directory:

```sh
node ./bin/run ./tmp/wikipedia_tr_all_maxi_2019-12 \
  --hostingdnsdomain=tr.wikipedia-on-ipfs.org \
  --hostingipnshash=QmVH1VzGBydSfmNG7rmdDjAeBZ71UVeEahVbNpFQtwZK8W \
  --zimfilesourceurl=https://download.kiwix.org/zim/wikipedia/wikipedia_tr_all_maxi_2019-12.zim \
  --kiwixmainpage=Kullanıcı:The_other_Kiwix_guy/Landing \
  --mainpage=Anasayfa.html \
  --mainpageversion=19869765
```

### Step 4: Import website directory to IPFS

#### Add immutable copy

Add all the data to your node using `ipfs add`. Use the following command, replacing `$unpacked_wiki` with the path to the website that you created in Step 4 (`./tmp/wikipedia_en_all_maxi_2018-10`).

```sh
$ ipfs add -r --cid-version 1 $unpacked_wiki
```

If you find it takes too long, and your IPFS node is located on the same machine,
consider running this step in offline mode:

```sh
$ ipfs add -r --cid-version 1 --offline $unpacked_wiki
```

Save the last hash of the output from the above process. It is the CID of the website.

### Step 6: Share the hash

Share the CID of your new snapshot so people can access it and replicate it onto their machines.

# Docker

A dockerfile with the software requirements is provided.

To build the docker image:

```sh
docker build . -t distributed-wikipedia-mirror-build
```

To use it as a development environment:

```sh
docker run -it -v $(pwd):/root/distributed-wikipedia-mirror -p 8080:8080 --entrypoint bash distributed-wikipedia-mirror-build
```

# How to Help

If you would like to contribute to this effort, look at the [issues](https://github.com/ipfs/distributed-wikipedia-mirror/issues) in this github repo. Especially check for [issues marked with the "wishlist" label](https://github.com/ipfs/distributed-wikipedia-mirror/labels/wishlist) and issues marked ["help wanted"](https://github.com/ipfs/distributed-wikipedia-mirror/labels/help%20wanted).
