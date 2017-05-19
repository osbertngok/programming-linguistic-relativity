package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type demoConfig struct {
	Urls []string
}

func loadURLFromConfig() []string {
	raw, _ := ioutil.ReadFile("../data/config.json")
	var config demoConfig
	err := json.Unmarshal(raw, &config)
	if err != nil {
		panic(err)
	}
	return config.Urls
}

func getBodyFromMultipleUrls(urls []string) <-chan string {
	ch := make(chan string, len(urls)) // buffered
	for _, url := range urls {
		go func(url string) {

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
		}(url)
	}
	return ch
}

func sumUpCharacterCount(strs <-chan string) int {
	characterCount := 0
	httpRequestCount := 0
	for {
		select {
		case str := <-strs:
			characterCount += len(str)
			httpRequestCount++
			if httpRequestCount == cap(strs) {
				return characterCount
			}
		}
	}
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
