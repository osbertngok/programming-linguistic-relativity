package main

import (
	"bufio"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

func loadURLFromConfig() <-chan string {
	urlCh := make(chan string, 100)
	r, _ := os.Open("../data/urls.lst")
	bufr := bufio.NewReader(r)
	go func() {
		for {
			url, err := bufr.ReadString('\n')
			if err != nil {
				if err == io.EOF {
					close(urlCh)
					return
				}
				panic(err)
			}
			urlCh <- strings.Trim(url, "\n")
		}
	}()
	return urlCh
}

func getBodyFromMultipleUrls(urls <-chan string) <-chan string {
	ch := make(chan string, 100) // buffered
	go func() {
		for url := range urls {
			resp, err := http.Get(url)
			if err != nil {
				panic(err)
			}
			defer resp.Body.Close()
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				panic(err)
			}
			ch <- string(body)

		}
		close(ch)
		return
	}()
	return ch
}

func sumUpCharacterCount(strs <-chan string) int {
	characterCount := 0
	for str := range strs {
		characterCount += len(str)
	}
	return characterCount
}

func printCount(count int) {
	fmt.Println(count)
}

func main() {
	urls := loadURLFromConfig()
	strs := getBodyFromMultipleUrls(urls)
	count := sumUpCharacterCount(strs)
	printCount(count)
}
